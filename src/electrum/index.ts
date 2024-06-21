import { Block } from 'bitcoinjs-lib';
import * as electrum from 'rn-electrum-client/helpers';

import {
	EAddressType,
	EAvailableNetworks,
	EElectrumNetworks,
	EScanningStrategy,
	IAddress,
	IAddresses,
	IElectrumGetAddressBalanceRes,
	IGetAddressHistoryResponse,
	IGetAddressScriptHashBalances,
	IGetAddressScriptHashesHistoryResponse,
	IGetAddressTxResponse,
	IGetHeaderResponse,
	IGetTransactions,
	IGetTransactionsFromInputs,
	IGetUtxosResponse,
	IHeader,
	INewBlock,
	IPeerData,
	ISubscribeToAddress,
	ISubscribeToHeader,
	ITransaction,
	ITxHash,
	IUtxo,
	Net,
	TAddressTypeContent,
	TConnectToElectrumRes,
	TGetAddressHistory,
	TOnMessage,
	TServer,
	TSubscribedReceive,
	TTxResponse,
	TTxResult,
	TUnspentAddressScriptHashData,
	TUnspentAddressScriptHashResponse,
	Tls
} from '../types';
import {
	err,
	filterAddressesForGapLimit,
	filterAddressesObjForGapLimit,
	filterAddressesObjForSingleIndex,
	filterAddressesObjForStartingIndex,
	getAddressFromScriptPubKey,
	getElectrumNetwork,
	getScriptHash,
	ok,
	Result,
	sleep,
	splitAddresses
} from '../utils';
import { Wallet } from '../wallet';
import { onMessageKeys, POLLING_INTERVAL } from '../shapes';

export class Electrum {
	private readonly _wallet: Wallet;
	private sendMessage: TOnMessage;
	private latestConnectionState: boolean | null = null;
	private connectionPollingInterval: NodeJS.Timeout | null;
	private net: Net;
	private tls: Tls;

	public servers?: TServer | TServer[];
	public network: EAvailableNetworks;
	public electrumNetwork: EElectrumNetworks;
	public connectedToElectrum: boolean;
	public onReceive?: (data: unknown) => void;
	public batchLimit: number;
	public batchDelay: number;

	constructor({
		wallet,
		network,
		net,
		tls,
		servers,
		batchLimit = 20,
		batchDelay = 50,
		onReceive
	}: {
		wallet: Wallet;
		network: EAvailableNetworks;
		net: Net;
		tls: Tls;
		servers?: TServer | TServer[];
		batchLimit?: number;
		batchDelay?: number;
		onReceive?: (data: unknown) => void;
	}) {
		this._wallet = wallet;
		this.sendMessage = wallet.sendMessage;
		this.servers = servers ?? [];
		this.network = network;
		this.electrumNetwork = getElectrumNetwork(this.network);
		this.connectedToElectrum = false;
		this.onReceive = onReceive;
		this.net = net;
		this.tls = tls;
		this.batchLimit = batchLimit;
		this.batchDelay = batchDelay;
		this.connectionPollingInterval = setInterval(
			(): Promise<void> => this.checkConnection(),
			POLLING_INTERVAL
		);
	}

	public get wallet(): Wallet {
		return this._wallet;
	}

	async connectToElectrum({
		network = this.network,
		servers,
		disableRegtestCheck = false // Used to ignore regtest check for certain tests.
	}: {
		network?: EAvailableNetworks;
		servers?: TServer | TServer[];
		disableRegtestCheck?: boolean;
	}): Promise<Result<TConnectToElectrumRes>> {
		let customPeers = servers
			? Array.isArray(servers)
				? servers
				: [servers]
			: [];
		// @ts-ignore
		customPeers = customPeers.length ? customPeers : this?.servers ?? [];
		const electrumNetwork = getElectrumNetwork(network);
		if (
			!disableRegtestCheck &&
			electrumNetwork === 'bitcoinRegtest' &&
			!customPeers.length
		) {
			return err('Regtest requires that you pre-specify a server.');
		}
		const startResponse = await electrum.start({
			network: electrumNetwork,
			net: this.net,
			tls: this.tls,
			customPeers
		});
		if (startResponse.error && !this.wallet.isSwitchingNetworks)
			return err(startResponse.error);
		this.network = network;
		this.electrumNetwork = electrumNetwork;
		if (customPeers.length) {
			this.servers = customPeers;
		}
		this.publishConnectionChange(true);
		this.subscribeToHeader().then();
		return ok('Connected to Electrum server.');
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

	async getAddressScriptHashBalances(
		scriptHashes: string[]
	): Promise<IGetAddressScriptHashBalances> {
		return await electrum.getAddressScriptHashBalances({
			scriptHashes,
			network: this.electrumNetwork
		});
	}

	/**
	 * Returns currently connected peer.
	 * @returns {Promise<Result<IPeerData>>}
	 */
	async getConnectedPeer(): Promise<Result<IPeerData>> {
		const response = await electrum.getConnectedPeer(this.electrumNetwork);
		if (response?.host && response?.port && response?.protocol) {
			return ok(response);
		}
		return err('No peer available.');
	}

	/**
	 * Queries Electrum to return the available UTXO's and balance of the provided addresses.
	 * @param {TUnspentAddressScriptHashData} addresses
	 * @returns {Promise<Result<IGetUtxosResponse>>}
	 */
	async listUnspentAddressScriptHashes({
		addresses
	}: {
		addresses: TUnspentAddressScriptHashData;
	}): Promise<Result<IGetUtxosResponse>> {
		try {
			const addressBatches = splitAddresses(addresses, this.batchLimit);
			let balance = 0;
			const utxos: IUtxo[] = [];
			for (const batch of addressBatches) {
				const unspentAddressResult: TUnspentAddressScriptHashResponse =
					await electrum.listUnspentAddressScriptHashes({
						scriptHashes: {
							key: 'scriptHash',
							data: batch
						},
						network: this.electrumNetwork
					});

				if (unspentAddressResult.error) {
					return err(JSON.stringify(unspentAddressResult?.data ?? ''));
				}

				unspentAddressResult.data.forEach(
					({ data, result: unspentAddresses }) => {
						if (unspentAddresses?.length > 0) {
							unspentAddresses.forEach((unspentAddress) => {
								balance += unspentAddress.value;
								utxos.push({
									...data,
									...unspentAddress
								});
							});
						}
					}
				);
				await sleep(this.batchDelay);
			}

			return ok({ utxos, balance });
		} catch (e) {
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
			const currentWallet = this._wallet.data;
			const currentAddresses: TAddressTypeContent<IAddresses> =
				currentWallet.addresses;
			const currentChangeAddresses: TAddressTypeContent<IAddresses> =
				currentWallet.changeAddresses;

			const addressIndexes = currentWallet.addressIndex;
			const changeAddressIndexes = currentWallet.changeAddressIndex;

			if (scriptHashes.length < 1) {
				const addressTypeKeys = this._wallet.addressTypesToMonitor;
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
						addressValues = filterAddressesForGapLimit({
							addresses: addressValues,
							index: addressIndex,
							gapLimitOptions: this._wallet.gapLimitOptions,
							change: false
						});
						changeAddressValues = filterAddressesForGapLimit({
							addresses: changeAddressValues,
							index: changeAddressIndex,
							gapLimitOptions: this._wallet.gapLimitOptions,
							change: true
						});
					}
					const utxoScriptHashes: IAddress[] = currentWallet.utxos;

					scriptHashes = [
						...utxoScriptHashes,
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
			const promises: Promise<IGetAddressScriptHashesHistoryResponse>[] = [];

			// split payload in chunks of 10 addresses per-request
			for (let i = 0; i < scriptHashes.length; i += this.batchLimit) {
				const chunk = scriptHashes.slice(i, i + this.batchLimit);
				const payload = {
					key: 'scriptHash',
					data: chunk
				};
				promises.push(
					electrum.getAddressScriptHashesHistory({
						scriptHashes: payload,
						network: this.electrumNetwork
					})
				);
				await sleep(this.batchDelay);
				promises.push(
					electrum.getAddressScriptHashesMempool({
						scriptHashes: payload,
						network: this.electrumNetwork
					})
				);
				await sleep(this.batchDelay);
			}

			const responses = await Promise.all(promises);
			responses.forEach((response) => {
				if (!response.error) {
					combinedResponse.push(...response.data);
				}
			});

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
			return err(e);
		}
	}

	/**
	 * Used to retrieve scriptPubkey history for LDK.
	 * @param {string} scriptPubkey
	 * @returns {Promise<TGetAddressHistory[]>}
	 */
	async getScriptPubKeyHistory(
		scriptPubkey: string
	): Promise<TGetAddressHistory[]> {
		const history: { txid: string; height: number }[] = [];
		const address = getAddressFromScriptPubKey(scriptPubkey, this.network);
		if (!address) {
			return history;
		}
		const scriptHash = getScriptHash({
			network: this.network,
			address
		});
		if (!scriptHash) {
			return history;
		}
		const response = await electrum.getAddressScriptHashesHistory({
			scriptHashes: [scriptHash],
			network: this.electrumNetwork
		});
		if (response.error) {
			return history;
		}
		await Promise.all(
			response.data.map(({ result }): void => {
				if (result && result?.length > 0) {
					result.map((item) => {
						history.push({
							txid: item?.tx_hash ?? '',
							height: item?.height ?? 0
						});
					});
				}
			})
		);
		return history;
	}

	/**
	 * Returns an array of tx_hashes and their height for a given array of address script hashes.
	 * @param {string[]} scriptHashes
	 * @returns {Promise<Result<TTxResponse>>}
	 */
	async getAddressScriptHashesHistory(
		scriptHashes: string[] = []
	): Promise<Result<IGetAddressTxResponse>> {
		const response = await electrum.getAddressScriptHashesHistory({
			scriptHashes,
			network: this.electrumNetwork
		});
		if (response.error) {
			return err(
				response?.data ?? 'Unable to get address script hashes history.'
			);
		}
		return ok(response);
	}

	/**
	 * Returns UTXO's for a given wallet and network along with the available balance.
	 * @param {EScanningStrategy} [scanningStrategy]
	 * @param {number} addressIndex
	 * @param {number} changeAddressIndex
	 * @param {EAddressType[]} [addressTypesToCheck]
	 * @returns {Promise<Result<IGetUtxosResponse>>}
	 */
	async getUtxos({
		scanningStrategy = EScanningStrategy.gapLimit,
		addressIndex,
		changeAddressIndex,
		addressTypesToCheck = this._wallet.addressTypesToMonitor
	}: {
		scanningStrategy?: EScanningStrategy;
		addressIndex?: number;
		changeAddressIndex?: number;
		addressTypesToCheck?: EAddressType[];
	}): Promise<Result<IGetUtxosResponse>> {
		try {
			if (!this.connectedToElectrum)
				await this.connectToElectrum({
					network: this.network,
					servers: this.servers
				});
			const currentWallet = this._wallet.data;

			let addresses = {} as IAddresses;
			let changeAddresses = {} as IAddresses;
			const existingUtxos: { [key: string]: IUtxo } = {};

			for (const addressType of addressTypesToCheck) {
				const addressCount = Object.keys(currentWallet.addresses[addressType])
					?.length;

				// Check if addresses of this type have been generated. If not, skip.
				if (addressCount <= 0) {
					break;
				}

				// Grab all addresses and change addresses.
				const allAddresses = currentWallet.addresses[addressType];
				const allChangeAddresses = currentWallet.changeAddresses[addressType];

				if (scanningStrategy === EScanningStrategy.all) {
					addresses = { ...addresses, ...allAddresses };
					changeAddresses = { ...changeAddresses, ...allChangeAddresses };
				} else {
					// Grab the current index for address/change addresses if none were provided.
					const _addressIndex =
						addressIndex === undefined
							? currentWallet.addressIndex[addressType].index
							: addressIndex;
					const _changeAddressIndex =
						changeAddressIndex === undefined
							? currentWallet.changeAddressIndex[addressType].index
							: changeAddressIndex;

					// Use the lowest index to ensure we're not starting above our current index.
					// TODO: Consider removing this entirely or at least updating it to allow up to the max stored address/change address index.
					const lowestAddressIndex = Math.min(
						_addressIndex,
						currentWallet.addressIndex[addressType].index
					);
					const lowestChangeAddressIndex = Math.min(
						_changeAddressIndex,
						currentWallet.changeAddressIndex[addressType].index
					);

					switch (scanningStrategy) {
						case EScanningStrategy.gapLimit:
							addresses = {
								...addresses,
								...filterAddressesObjForGapLimit({
									addresses: allAddresses,
									index: lowestAddressIndex,
									gapLimitOptions: this._wallet.gapLimitOptions,
									change: false
								})
							};
							changeAddresses = {
								...changeAddresses,
								...filterAddressesObjForGapLimit({
									addresses: allChangeAddresses,
									index: lowestChangeAddressIndex,
									gapLimitOptions: this._wallet.gapLimitOptions,
									change: true
								})
							};
							break;
						case EScanningStrategy.startingIndex:
							addresses = {
								...addresses,
								...filterAddressesObjForStartingIndex({
									addresses: allAddresses,
									index: lowestAddressIndex
								})
							};
							changeAddresses = {
								...changeAddresses,
								...filterAddressesObjForStartingIndex({
									addresses: allChangeAddresses,
									index: lowestChangeAddressIndex
								})
							};
							break;
						case EScanningStrategy.singleIndex:
							addresses = {
								...addresses,
								...filterAddressesObjForSingleIndex({
									addresses: allAddresses,
									addressIndex: _addressIndex
								})
							};
							changeAddresses = {
								...changeAddresses,
								...filterAddressesObjForSingleIndex({
									addresses: allChangeAddresses,
									addressIndex: _changeAddressIndex
								})
							};
							break;
					}
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
			const promises: Promise<IGetTransactions>[] = [];

			// split payload in chunks of 10 transactions per-request
			for (let i = 0; i < txHashes.length; i += this.batchLimit) {
				const chunk = txHashes.slice(i, i + this.batchLimit);

				const data = {
					key: 'tx_hash',
					data: chunk
				};

				promises.push(
					electrum.getTransactions({
						txHashes: data,
						network: this.electrumNetwork
					})
				);
				await sleep(this.batchDelay);
			}
			const responses = await Promise.all(promises);
			responses.forEach((response) => {
				if (!response.error) result.push(...response.data);
			});
			return ok({
				error: false,
				id: 0,
				method: 'getTransactions',
				network: this.electrumNetwork,
				data: result
			});
		} catch (e) {
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
			if (response && !response.error) {
				return ok(response);
			} else {
				if (response?.error?.message) return err(response.error.message);
				return err(response ?? 'Unable to get transactions from inputs.');
			}
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Returns the merkle branch to a confirmed transaction given its hash and height.
	 * @param {string} tx_hash
	 * @param {number} height
	 * @returns {Promise<{ merkle: string[]; block_height: number; pos: number }>}
	 */
	async getTransactionMerkle({
		tx_hash,
		height
	}: {
		tx_hash: string;
		height: number;
	}): Promise<{
		merkle: string[];
		block_height: number;
		pos: number;
	}> {
		return await electrum.getTransactionMerkle({
			tx_hash,
			height,
			network: this.electrumNetwork
		});
	}

	/**
	 * Subscribes to the current networks headers.
	 * @return {Promise<Result<string>>}
	 */
	public async subscribeToHeader(): Promise<Result<IHeader>> {
		const subscribeResponse: ISubscribeToHeader =
			await electrum.subscribeHeader({
				network: this.electrumNetwork,
				onReceive: async (data: INewBlock[]) => {
					const hex = data[0].hex;
					const hash = this.getBlockHashFromHex({ blockHex: hex });
					const header: IHeader = { ...data[0], hash };
					const reorgDetected = header.height < this.getBlockHeader().height;
					await this._wallet.updateHeader(header);
					if (reorgDetected) {
						await this._wallet.checkUnconfirmedTransactions(reorgDetected);
					}
					await this._wallet.refreshWallet();
					this.onReceive?.(data);
					this.sendMessage(onMessageKeys.newBlock, data[0]);
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
		await this._wallet.updateHeader(header);
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
		const allUtxos: IUtxo[] = [];
		const currentWallet = this._wallet.data;
		const addressTypeKeys = this._wallet.addressTypesToMonitor;
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
					const addressesInRangeToSubscribe = filterAddressesForGapLimit({
						addresses: Object.values(addresses),
						index: addressIndex,
						gapLimitOptions: this._wallet.gapLimitOptions,
						change: false
					});
					const _scriptHashes = addressesInRangeToSubscribe.map(
						(address) => address.scriptHash
					);
					scriptHashes.push(..._scriptHashes);
				}
			}
			// Keep an eye on existing UTXO's regardless of the gap limit.
			currentWallet.utxos.forEach((utxo) => {
				if (!scriptHashes.includes(utxo.scriptHash)) {
					allUtxos.push(utxo);
				}
			});
		}

		// Subscribe to all provided script hashes.
		const allScriptHashesPromises = scriptHashes.map(async (scriptHash) => {
			const response: ISubscribeToAddress = await electrum.subscribeAddress({
				scriptHash,
				network: this.electrumNetwork,
				onReceive: async (data: TSubscribedReceive): Promise<void> => {
					onReceive?.(data);
					this._wallet.refreshWallet({});
				}
			});
			if (response.error) {
				throw Error('Unable to subscribe to receiving addresses.');
			}
		});

		const allUtxosPromises = allUtxos.map(async (utxo) => {
			const response: ISubscribeToAddress = await electrum.subscribeAddress({
				scriptHash: utxo.scriptHash,
				network: this.electrumNetwork,
				onReceive: async (data: TSubscribedReceive): Promise<void> => {
					onReceive?.(data);
					await this.getUtxos({
						scanningStrategy: EScanningStrategy.singleIndex,
						addressIndex: utxo.index,
						changeAddressIndex: utxo.index
					});
					this._wallet.refreshWallet({});
				}
			});
			if (response.error) {
				throw Error('Unable to subscribe to receiving addresses.');
			}
		});

		try {
			await Promise.all([...allScriptHashesPromises, ...allUtxosPromises]);
		} catch (e) {
			return err(e);
		}

		return ok('Successfully subscribed to addresses.');
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
			const transaction = this._wallet.transaction.data;
			await Promise.all(
				transaction.outputs.map(async (o) => {
					const address = o?.address;
					if (address) {
						const scriptHash = getScriptHash({
							address,
							network: this.network
						});
						if (scriptHash) {
							await this.subscribeToAddresses({
								scriptHashes: [scriptHash]
							});
						}
					}
				})
			);
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

	/**
	 * Attempts to check the current Electrum connection.
	 * @private
	 * @returns {Promise<void>}
	 */
	private async checkConnection(): Promise<void> {
		try {
			const { error } = await electrum.pingServer();

			if (error) {
				console.log('Connection to Electrum Server lost, reconnecting...');
				const response = await this.connectToElectrum({
					network: this.network,
					servers: this.servers
				});

				if (response.isOk()) {
					// Re-Subscribe to Addresses & Headers
					this.subscribeToAddresses({});
					this.subscribeToHeader().then();
				} else {
					this.publishConnectionChange(false);
				}
			} else {
				this.publishConnectionChange(true);
			}
		} catch (e) {
			console.error(e);
			this.publishConnectionChange(false);
		}
	}

	private publishConnectionChange(isConnected: boolean): void {
		if (
			this.latestConnectionState !== isConnected &&
			!this.wallet.isSwitchingNetworks
		) {
			this.sendMessage('connectedToElectrum', isConnected);
			this.connectedToElectrum = isConnected;
			this.latestConnectionState = isConnected;
		}
	}

	public async disconnect(): Promise<void> {
		this.stopConnectionPolling();
		await electrum.stop();
	}

	public startConnectionPolling(): void {
		if (this.connectionPollingInterval) return;
		this.connectionPollingInterval = setInterval(
			(): Promise<void> => this.checkConnection(),
			POLLING_INTERVAL
		);
	}

	public stopConnectionPolling(): void {
		if (this.connectionPollingInterval) {
			clearInterval(this.connectionPollingInterval);
			this.connectionPollingInterval = null;
		}
	}
}
