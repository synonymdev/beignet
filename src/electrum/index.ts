import {
	EAddressType,
	EAvailableNetworks,
	IAddress,
	IAddresses,
	TAddressTypeContent,
	IConnectToElectrumRes,
	IElectrumGetAddressBalanceRes,
	IGetAddressHistoryResponse,
	IGetAddressScriptHashesHistoryResponse,
	IGetHeaderResponse,
	IGetTransactions,
	IGetTransactionsFromInputs,
	IGetUtxosResponse,
	IHeader,
	INewBlock,
	ISubscribeToAddress,
	ISubscribeToHeader,
	ITransaction,
	ITxHash,
	IUtxo,
	TElectrumNetworks,
	TMessageKeys,
	TServer,
	TSubscribedReceive,
	TTxResponse,
	TTxResult,
	TUnspentAddressScriptHashData
} from '../types';
import * as electrum from 'rn-electrum-client/helpers';
import { err, ok, Result } from '../utils';
import { Wallet } from '../wallet';
import { CHUNK_LIMIT, GAP_LIMIT } from '../wallet/constants';
import { getScriptHash, objectKeys } from '../utils';
import { addressTypes } from '../shapes';
import { Block } from 'bitcoinjs-lib';
import { onMessageKeys } from '../shapes';
import { Server } from 'net';
import { TLSSocket } from 'tls';

let tls, net;
try {
	tls = require('tls');
	net = require('net');
} catch {
	// Modules not available, will attempt to use passed instances, if any.
}

export class Electrum {
	private wallet: Wallet;

	public servers?: TServer | TServer[];
	public network: EAvailableNetworks;
	public electrumNetwork: TElectrumNetworks;
	public connectedToElectrum: boolean;
	public onReceive?: (data: unknown) => void;
	constructor({
		wallet,
		servers,
		network,
		onReceive,
		tls: _tls,
		net: _net
	}: {
		wallet: Wallet;
		servers?: TServer | TServer[];
		network: EAvailableNetworks;
		onReceive?: (data: unknown) => void;
		tls?: TLSSocket;
		net?: Server;
	}) {
		this.wallet = wallet;
		this.servers = servers ?? [];
		this.network = network;
		this.electrumNetwork = this.getElectrumNetwork(network);
		this.connectedToElectrum = false;
		this.onReceive = onReceive;
		if (!tls) tls = _tls;
		if (!net) net = _net;
		if (!tls || !net) {
			throw new Error(
				'TLS and NET modules are not available and were not passed as instances'
			);
		}
	}

	async connectToElectrum({
		network,
		servers
	}: {
		network: EAvailableNetworks;
		servers?: TServer | TServer[];
	}): Promise<IConnectToElectrumRes> {
		this.servers = servers
			? Array.isArray(servers)
				? servers
				: [servers]
			: [];
		const customPeers = this.servers;
		const electrumNetwork = this.getElectrumNetwork(network);
		const startResponse = await electrum.start({
			network: electrumNetwork,
			tls,
			net,
			customPeers
		});
		if (startResponse.error) return { error: true };
		await this.subscribeToHeader();
		this.connectedToElectrum = true;
		return { error: false };
	}

	async isConnected(): Promise<boolean> {
		const { error } = await electrum.pingServer();
		return !error;
	}

	/**
	 * Returns the balance in sats for a given address.
	 * @param {string} scriptHash
	 * @return {number}
	 */
	async getAddressBalance(
		scriptHash: string
	): Promise<IElectrumGetAddressBalanceRes> {
		if (!this.connectedToElectrum)
			await this.connectToElectrum({
				network: this.network,
				servers: this.servers
			});
		const network = this.electrumNetwork;
		const response = await electrum.getAddressScriptHashBalance({
			scriptHash,
			network
		});
		if (response.error) {
			return { error: response.error, confirmed: 0, unconfirmed: 0 };
		}
		const { confirmed, unconfirmed } = response.data;
		return { error: response.error, confirmed, unconfirmed };
	}

	/**
	 * Returns the network string for use with Electrum methods.
	 * @param {EAvailableNetworks} [network]
	 * @return {TElectrumNetworks}
	 */
	getElectrumNetwork(network: EAvailableNetworks): TElectrumNetworks {
		switch (network) {
			case 'bitcoin':
				return 'bitcoin';
			case 'testnet':
				return 'bitcoinTestnet';
			case 'regtest':
				return 'bitcoinRegtest';
			default:
				return 'bitcoinTestnet';
		}
	}

	/**
	 * Queries Electrum to return the available UTXO's and balance of the provided addresses.
	 * @param {EAvailableNetworks} [selectedNetwork]
	 * @param {TUnspentAddressScriptHashData} addresses
	 */
	async listUnspentAddressScriptHashes({
		addresses
	}: {
		addresses: TUnspentAddressScriptHashData;
	}): Promise<Result<IGetUtxosResponse>> {
		try {
			const unspentAddressResult =
				await electrum.listUnspentAddressScriptHashes({
					scriptHashes: {
						key: 'scriptHash',
						data: addresses
					},
					network: this.electrumNetwork
				});
			if (unspentAddressResult.error) {
				return err(unspentAddressResult.error);
			}
			let balance = 0;
			const utxos: IUtxo[] = [];
			unspentAddressResult.data.map(({ data, result }) => {
				if (result?.length > 0) {
					return result.map((unspentAddress: IUtxo) => {
						balance = balance + unspentAddress.value;
						utxos.push({
							...data,
							...unspentAddress
						});
					});
				}
			});
			return ok({ utxos, balance });
		} catch (e) {
			// @ts-ignore
			return err(e);
		}
	}

	/**
	 * Returns the available history for the provided address script hashes.
	 * @param {IAddress[]} [scriptHashes]
	 * @param {boolean} [scanAllAddresses]
	 * @returns {Promise<Result<IGetAddressHistoryResponse[]>>}
	 */
	async getAddressHistory({
		scriptHashes = [],
		scanAllAddresses = false
	}: {
		scriptHashes?: IAddress[];
		scanAllAddresses?: boolean;
	}): Promise<Result<IGetAddressHistoryResponse[]>> {
		try {
			if (!this.connectedToElectrum)
				await this.connectToElectrum({
					network: this.network,
					servers: this.servers
				});
			const currentWallet = this.wallet.data;
			const currentAddresses: TAddressTypeContent<IAddresses> =
				currentWallet.addresses;
			const currentChangeAddresses: TAddressTypeContent<IAddresses> =
				currentWallet.changeAddresses;

			const addressIndexes = currentWallet.addressIndex;
			const changeAddressIndexes = currentWallet.changeAddressIndex;

			if (scriptHashes.length < 1) {
				const addressTypeKeys = objectKeys(addressTypes);
				addressTypeKeys.forEach((addressType) => {
					const addresses = currentAddresses[addressType];
					const changeAddresses = currentChangeAddresses[addressType];
					let addressValues = Object.values(addresses);
					let changeAddressValues = Object.values(changeAddresses);

					const addressIndex = addressIndexes[addressType].index;
					const changeAddressIndex = changeAddressIndexes[addressType].index;

					// Instead of scanning all addresses, adhere to the gap limit.
					if (
						!scanAllAddresses &&
						addressIndex >= 0 &&
						changeAddressIndex >= 0
					) {
						addressValues = addressValues.filter(
							(a) => Math.abs(addressIndex - a.index) <= GAP_LIMIT
						);
						changeAddressValues = changeAddressValues.filter(
							(a) => Math.abs(changeAddressIndex - a.index) <= GAP_LIMIT
						);
					}

					scriptHashes = [
						...scriptHashes,
						...addressValues,
						...changeAddressValues
					];
				});
			}
			// remove items with same path
			scriptHashes = scriptHashes.filter((sh, index, arr) => {
				return index === arr.findIndex((v) => sh.path === v.path);
			});
			if (scriptHashes.length < 1) {
				return err('No scriptHashes available to check.');
			}

			const combinedResponse: TTxResponse[] = [];

			// split payload in chunks of 10 addresses per-request
			for (let i = 0; i < scriptHashes.length; i += CHUNK_LIMIT) {
				const chunk = scriptHashes.slice(i, i + CHUNK_LIMIT);
				const payload = {
					key: 'scriptHash',
					data: chunk
				};

				const response: IGetAddressScriptHashesHistoryResponse =
					await electrum.getAddressScriptHashesHistory({
						scriptHashes: payload,
						network: this.electrumNetwork
					});

				const mempoolResponse: IGetAddressScriptHashesHistoryResponse =
					await electrum.getAddressScriptHashesMempool({
						scriptHashes: payload,
						network: this.electrumNetwork
					});

				if (response.error || mempoolResponse.error) {
					return err('Unable to get address history.');
				}
				combinedResponse.push(...response.data, ...mempoolResponse.data);
			}

			const history: IGetAddressHistoryResponse[] = [];
			combinedResponse.forEach(
				({ data, result }: { data: IAddress; result: TTxResult[] }): void => {
					if (result && result?.length > 0) {
						result.forEach((item) => {
							history.push({ ...data, ...item });
						});
					}
				}
			);
			return ok(history);
		} catch (e) {
			// @ts-ignore
			return err(e);
		}
	}

	/**
	 * Returns UTXO's for a given wallet and network along with the available balance.
	 * @param {boolean} [scanAllAddresses]
	 * @returns {Promise<Result<IGetUtxosResponse>>}
	 */
	async getUtxos({
		scanAllAddresses = false
	}: {
		scanAllAddresses?: boolean;
	}): Promise<Result<IGetUtxosResponse>> {
		try {
			if (!this.connectedToElectrum)
				await this.connectToElectrum({
					network: this.network,
					servers: this.servers
				});
			const currentWallet = this.wallet.data;

			const addressTypeKeys = Object.values(EAddressType);
			let addresses = {} as IAddresses;
			let changeAddresses = {} as IAddresses;
			const existingUtxos: { [key: string]: IUtxo } = {};

			for (const addressType of addressTypeKeys) {
				const addressCount = Object.keys(currentWallet.addresses[addressType])
					?.length;

				// Check if addresses of this type have been generated. If not, skip.
				if (addressCount <= 0) {
					break;
				}

				// Grab the current index for both addresses and change addresses.
				const addressIndex = currentWallet.addressIndex[addressType].index;
				const changeAddressIndex =
					currentWallet.changeAddressIndex[addressType].index;

				// Grab all addresses and change addresses.
				const allAddresses = currentWallet.addresses[addressType];
				const allChangeAddresses = currentWallet.changeAddresses[addressType];

				// Instead of scanning all addresses, adhere to the gap limit.
				if (!scanAllAddresses && addressIndex >= 0 && changeAddressIndex >= 0) {
					Object.values(allAddresses).map((a) => {
						if (Math.abs(a.index - addressIndex) <= GAP_LIMIT) {
							addresses[a.scriptHash] = a;
						}
					});
					Object.values(allChangeAddresses).map((a) => {
						if (Math.abs(a.index - changeAddressIndex) <= GAP_LIMIT) {
							changeAddresses[a.scriptHash] = a;
						}
					});
				} else {
					addresses = { ...addresses, ...allAddresses };
					changeAddresses = { ...changeAddresses, ...allChangeAddresses };
				}
			}

			// Make sure we're re-check existing utxos that may exist outside the gap limit and putting them in the necessary format.
			currentWallet.utxos.map((utxo) => {
				existingUtxos[utxo.scriptHash] = utxo;
			});

			const data: TUnspentAddressScriptHashData = {
				...addresses,
				...changeAddresses,
				...existingUtxos
			};

			return this.listUnspentAddressScriptHashes({ addresses: data });
		} catch (e) {
			// @ts-ignore
			return err(e);
		}
	}

	/**
	 * Returns available transactions from electrum based on the provided txHashes.
	 * @param {ITxHash[]} txHashes
	 * @return {Promise<Result<IGetTransactions>>}
	 */
	async getTransactions({
		txHashes = []
	}: {
		txHashes: ITxHash[];
	}): Promise<Result<IGetTransactions>> {
		try {
			if (txHashes.length < 1) {
				return ok({
					error: false,
					id: 0,
					method: 'getTransactions',
					network: this.electrumNetwork,
					data: []
				});
			}

			const result: ITransaction<IUtxo>[] = [];

			// split payload in chunks of 10 transactions per-request
			for (let i = 0; i < txHashes.length; i += CHUNK_LIMIT) {
				const chunk = txHashes.slice(i, i + CHUNK_LIMIT);

				const data = {
					key: 'tx_hash',
					data: chunk
				};
				const response = await electrum.getTransactions({
					txHashes: data,
					network: this.electrumNetwork
				});
				if (response.error) {
					return err(response);
				}
				result.push(...response.data);
			}
			return ok({
				error: false,
				id: 0,
				method: 'getTransactions',
				network: this.electrumNetwork,
				data: result
			});
		} catch (e) {
			// @ts-ignore
			return err(e);
		}
	}

	/**
	 * Determines whether a transaction exists based on the transaction response from electrum.
	 * @param {ITransaction<IUtxo>} txData
	 * @returns {boolean}
	 */
	public transactionExists(txData: ITransaction<IUtxo>): boolean {
		if (
			// @ts-ignore
			txData?.error &&
			// @ts-ignore
			txData?.error?.message &&
			/No such mempool or blockchain transaction|Invalid tx hash/.test(
				// @ts-ignore
				txData?.error?.message
			)
		) {
			//Transaction was removed/bumped from the mempool or potentially reorg'd out.
			return false;
		}
		return true;
	}

	/**
	 * Returns the block hex of the provided block height.
	 * @param {number} [height]
	 * @param {TAvailableNetworks} [selectedNetwork]
	 * @returns {Promise<Result<string>>}
	 */
	public async getBlockHex({
		height = 0
	}: {
		height?: number;
	}): Promise<Result<string>> {
		const response: IGetHeaderResponse = await electrum.getHeader({
			height,
			network: this.electrumNetwork
		});
		if (response.error) {
			return err(response.data);
		}
		return ok(response.data);
	}

	/**
	 * Returns the block hash given a block hex.
	 * Leaving blockHex empty will return the last known block hash from storage.
	 * @param {string} [blockHex]
	 * @param {TAvailableNetworks} [selectedNetwork]
	 * @returns {string}
	 */
	public getBlockHashFromHex({ blockHex }: { blockHex?: string }): string {
		// If empty, return the last known block hex from storage.
		if (!blockHex) {
			const { hex } = this.getBlockHeader();
			blockHex = hex;
		}
		if (!blockHex) return '';
		const block = Block.fromHex(blockHex);
		const hash = block.getId();
		return hash;
	}

	/**
	 * Returns last known block height, and it's corresponding hex from local storage.
	 * @returns {IHeader}
	 */
	public getBlockHeader(): IHeader {
		return this.wallet.data.header;
	}

	/**
	 * Returns transactions associated with the provided transaction hashes.
	 * @param {ITxHash[]} txHashes
	 * @return {Promise<Result<IGetTransactionsFromInputs>>}
	 */
	async getTransactionsFromInputs({
		txHashes = []
	}: {
		txHashes: ITxHash[];
	}): Promise<Result<IGetTransactionsFromInputs>> {
		try {
			const data = {
				key: 'tx_hash',
				data: txHashes
			};
			const response = await electrum.getTransactions({
				txHashes: data,
				network: this.electrumNetwork
			});
			if (!response.error) {
				return ok(response);
			} else {
				return err(response);
			}
		} catch (e) {
			// @ts-ignore
			return err(e);
		}
	}

	/**
	 * Subscribes to the current networks headers.
	 * @return {Promise<Result<string>>}
	 */
	public async subscribeToHeader(): Promise<Result<IHeader>> {
		const subscribeResponse: ISubscribeToHeader =
			await electrum.subscribeHeader({
				network: this.electrumNetwork,
				onReceive: (data: INewBlock[]) => {
					const hex = data[0].hex;
					const hash = this.getBlockHashFromHex({ blockHex: hex });
					this.wallet.data.header = { ...data[0], hash };
					this.onReceive?.(data);
					if (this.wallet?.onMessage)
						this.wallet.onMessage(onMessageKeys.newBlock, data[0]);
				}
			});
		if (subscribeResponse.error) {
			return err('Unable to subscribe to headers.');
		}
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		if (subscribeResponse?.data === 'Already Subscribed.') {
			return ok(this.getBlockHeader());
		}
		// Update local storage with current height and hex.
		const hex = subscribeResponse.data.hex;
		const hash = this.getBlockHashFromHex({ blockHex: hex });
		const header = { ...subscribeResponse.data, hash };
		this.wallet.data.header = header;
		return ok(header);
	}

	/**
	 * Subscribes to a number of address script hashes for receiving.
	 * @param {string[]} scriptHashes
	 * @param onReceive
	 * @return {Promise<Result<string>>}
	 */
	async subscribeToAddresses({
		scriptHashes = [],
		onReceive
	}: {
		scriptHashes?: string[];
		onReceive?: (data: TSubscribedReceive) => void;
	} = {}): Promise<Result<string>> {
		const currentWallet = this.wallet.data;
		const addressTypeKeys = objectKeys(addressTypes);
		// Gather the receiving address scripthash for each address type if no scripthashes were provided.
		if (!scriptHashes.length) {
			for (const addressType of addressTypeKeys) {
				const addresses = currentWallet.addresses[addressType];
				const addressCount = Object.keys(addresses).length;

				// Check if addresses of this type have been generated. If not, skip.
				if (addressCount > 0) {
					let addressIndex = currentWallet.addressIndex[addressType]?.index;
					addressIndex = addressIndex > 0 ? addressIndex : 0;

					// Only subscribe up to the gap limit.
					const addressesInRange = Object.values(addresses).filter(
						(address) => Math.abs(address.index - addressIndex) <= GAP_LIMIT
					);
					const addressesToSubscribe = addressesInRange.slice(-GAP_LIMIT);
					const addressScriptHashes = addressesToSubscribe.map(
						({ scriptHash }) => scriptHash
					);
					scriptHashes.push(...addressScriptHashes);
				}
			}
		}

		// Subscribe to all provided script hashes.
		const promises = scriptHashes.map(async (scriptHash) => {
			const response: ISubscribeToAddress = await electrum.subscribeAddress({
				scriptHash,
				network: this.electrumNetwork,
				onReceive: async (data: TSubscribedReceive): Promise<void> => {
					onReceive?.(data);
					this.onReceiveAddress(data);
					this.wallet.refreshWallet({});
				}
			});
			if (response.error) {
				throw Error('Unable to subscribe to receiving addresses.');
			}
		});

		try {
			await Promise.all(promises);
		} catch (e) {
			console.log(e);
			// @ts-ignore
			return err(e);
		}

		return ok('Successfully subscribed to addresses.');
	}

	private async onReceiveAddress(data): Promise<void> {
		if (!this.wallet?.onMessage) return;
		const receivedAt = data[0];
		const balance = await this.wallet.getScriptHashBalance(receivedAt);
		if (balance.isErr()) return;
		const address = this.wallet.getAddressFromScriptHash(receivedAt);
		if (!address) {
			console.log('Unable to run getAddressFromScriptHash');
			return;
		}
		const history = await this.getAddressHistory({
			scriptHashes: [address]
		});
		if (history.isErr()) {
			console.log(history.error.message);
			return;
		}
		if (!history.value.length) return;
		let message: TMessageKeys = onMessageKeys.transactionConfirmed;
		const lastTx = history.value[history.value.length - 1];
		const unconfirmedTransactions: string[] = Object.values(
			this.wallet.data.unconfirmedTransactions
		).map((tx) => tx.txid);
		if (!unconfirmedTransactions.includes(lastTx.tx_hash))
			message = onMessageKeys.transactionReceived;
		if (balance.value.unconfirmed <= 0) message = onMessageKeys.transactionSent;
		const txs: TTxResult[] = history.value.map((tx) => {
			return {
				tx_hash: tx.tx_hash,
				height: tx.height
			};
		});
		this.wallet.onMessage(message, {
			balance: balance.value,
			address: address,
			txs
		});
	}

	public async broadcastTransaction({
		rawTx,
		subscribeToOutputAddress = true
	}: {
		rawTx: string;
		subscribeToOutputAddress?: boolean;
	}): Promise<Result<string>> {
		/**
		 * Subscribe to the output address and refresh the wallet when the Electrum server detects it.
		 * This prevents updating the wallet prior to the Electrum server detecting the new tx in the mempool.
		 */
		if (subscribeToOutputAddress) {
			const transaction = this.wallet.transaction.data;
			for (const o of transaction.outputs) {
				const address = o?.address;
				if (address) {
					const scriptHash = getScriptHash({ address, network: this.network });
					if (scriptHash) {
						await this.subscribeToAddresses({
							scriptHashes: [scriptHash]
						});
					}
				}
			}
		}

		const broadcastResponse = await electrum.broadcastTransaction({
			rawTx,
			network: this.electrumNetwork
		});
		// TODO: This needs to be resolved in rn-electrum-client
		if (broadcastResponse.error || broadcastResponse.data.includes(' ')) {
			return err(broadcastResponse.data);
		}
		return ok(broadcastResponse.data);
	}
}
