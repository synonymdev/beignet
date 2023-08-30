import * as bitcoin from 'bitcoinjs-lib';
import { Network } from 'bitcoinjs-lib';
import BIP32Factory, { BIP32Interface } from 'bip32';
import * as ecc from '@bitcoinerlab/secp256k1';
//import { getExchangeRates } from "../utils/exchange-rate";
import {
	EAddressType,
	EAvailableNetworks,
	EPaymentType,
	IAddress,
	IAddresses,
	TAddressTypeContent,
	IExchangeRates,
	IFees,
	IFormattedTransaction,
	IFormattedTransactions,
	IGenerateAddresses,
	IGenerateAddressesResponse,
	IGetAddress,
	IGetAddressBalanceRes,
	IGetAddressByPath,
	IGetAddressResponse,
	IGetFeeEstimatesResponse,
	IGetNextAvailableAddressResponse,
	IGetUtxosResponse,
	IHeader,
	IKeyDerivationPath,
	InputData,
	ISendTransaction,
	ISendTx,
	TSetData,
	ISetupTransaction,
	ITransaction,
	ITxHash,
	IUtxo,
	IWallet,
	IWalletData,
	TAddressIndexInfo,
	TAvailableNetworks,
	TOnMessage,
	TProcessUnconfirmedTransactions,
	TServer,
	TSetupTransactionResponse,
	TWalletDataKeys,
	TGetData,
	EFeeId,
	IBoostedTransactions,
	IRbfData,
	IOutput,
	IBoostedTransaction,
	EBoostType,
	ICustomGetAddress,
	ICustomGetScriptHash
} from '../types';
import {
	decodeOpReturnMessage,
	getAddressTypeFromPath,
	getExchangeRates,
	getKeyDerivationPathObject,
	getKeyDerivationPathString
} from '../utils';
import {
	formatKeyDerivationPath,
	getDataFallback,
	getDefaultWalletData,
	getDefaultWalletDataKeys,
	getHighestUsedIndexFromTxHashes,
	getKeyDerivationPath,
	getScriptHash,
	getSha256,
	objectKeys,
	shuffleArray,
	validateAddress,
	validateMnemonic
} from '../utils';
import {
	addressTypes,
	defaultFeesShape,
	getAddressTypeContent,
	getDefaultSendTransaction
} from '../shapes';
import { err, ok, Result } from '../utils';
import { Electrum } from '../electrum';
import { Transaction } from '../transaction';
import { CHUNK_LIMIT, GAP_LIMIT, GENERATE_ADDRESS_AMOUNT } from './constants';
import cloneDeep from 'lodash.clonedeep';
import { btcToSats } from '../utils/conversion';
import bip39 = require('bip39');

const bip32 = BIP32Factory(ecc);

export class Wallet {
	private readonly mnemonic: string;
	private readonly passphrase: string;
	private readonly seed: Buffer;
	private readonly root: BIP32Interface;
	private readonly walletName: string;
	private getData: TGetData;
	private setData?: TSetData;
	public network: EAvailableNetworks;
	public addressType: EAddressType;
	public data: IWalletData;
	public electrumOptions?: {
		servers?: TServer | TServer[];
	};
	public electrum: Electrum;
	public exchangeRates: IExchangeRates;
	public onMessage?: TOnMessage;
	public transaction: Transaction;
	public feeEstimates: IFees;
	public rbf: boolean;
	public selectedFeeId: EFeeId;
	private customGetAddress?: (
		data: ICustomGetAddress
	) => Promise<Result<IGetAddressResponse>>; // For use with Bitkit.
	private customGetScriptHash?: (data: ICustomGetScriptHash) => Promise<string>; // For use with Bitkit.
	private constructor({
		mnemonic,
		passphrase,
		walletName,
		network = EAvailableNetworks.mainnet,
		addressType = EAddressType.p2wpkh,
		storage,
		electrumOptions,
		onMessage,
		customGetAddress,
		customGetScriptHash,
		rbf = true,
		selectedFeeId = EFeeId.normal
	}: IWallet) {
		if (!mnemonic) throw new Error('No mnemonic specified.');
		if (!validateMnemonic(mnemonic)) throw new Error('Invalid mnemonic.');
		if (walletName && walletName.includes('-'))
			throw new Error('Wallet name cannot include a hyphen (-).');
		this.mnemonic = mnemonic;
		this.passphrase = passphrase ?? '';
		this.walletName = walletName ?? 'wallet0';
		this.network = network;
		this.addressType = addressType;
		this.seed = bip39.mnemonicToSeedSync(this.mnemonic, this.passphrase);
		this.root = bip32.fromSeed(this.seed, this.getBitcoinNetwork(this.network));
		this.data = getDefaultWalletData();
		this.getData = storage?.getData ?? getDataFallback;
		this.setData = storage?.setData;
		this.exchangeRates = {};
		this.transaction = new Transaction({
			wallet: this,
			mnemonic: this.mnemonic,
			passphrase: this.passphrase
		});
		this.feeEstimates = cloneDeep(defaultFeesShape);
		this.onMessage = onMessage;
		this.electrumOptions = electrumOptions;
		this.electrum = new Electrum({
			wallet: this,
			network: this.network,
			servers: electrumOptions?.servers
		});
		if (customGetAddress) this.customGetAddress = customGetAddress;
		if (customGetScriptHash) this.customGetScriptHash = customGetScriptHash;
		this.rbf = rbf;
		this.selectedFeeId = selectedFeeId;
	}

	static async create(params: IWallet): Promise<Result<Wallet>> {
		try {
			let walletName = params?.walletName;
			if (!walletName) {
				// If no name is provided, use the sha256 hash of the mnemonic + passphrase to generate a unique wallet name when getting/setting data.
				const str = `${params.mnemonic}${params.passphrase}`;
				walletName = getSha256(str);
				console.log('Wallet Name:', walletName);
			}
			const wallet = new Wallet({ ...params, walletName });
			const res = await wallet.setWalletData();
			if (res.isErr()) return err(res.error.message);
			const exchangeRates = await getExchangeRates();
			if (exchangeRates.isOk()) wallet.exchangeRates = exchangeRates.value;
			const feeEstimates = await wallet.getFeeEstimates();
			if (feeEstimates) wallet.feeEstimates = feeEstimates;
			console.log('Syncing Wallet...');
			await wallet.refreshWallet({});
			return ok(wallet);
		} catch (e) {
			// @ts-ignore
			return err(e);
		}
	}

	public async switchNetwork(
		network: EAvailableNetworks,
		servers?: TServer | TServer[]
	): Promise<Result<Wallet>> {
		this.network = network;
		const params: IWallet = {
			...this,
			mnemonic: this.mnemonic,
			passphrase: this.passphrase,
			network,
			servers,
			storage: {
				getData: this.getData,
				setData: this.setData
			}
		};
		const createRes = await Wallet.create(params);
		if (createRes.isErr()) return err(createRes.error.message);
		Object.assign(this, createRes.value);
		return ok(this);
	}

	/**
	 * Updates the address type for the current wallet.
	 * @param {EAddressType} addressType
	 * @returns {Promise<void>}
	 */
	async updateAddressType(addressType: EAddressType): Promise<void> {
		this.addressType = addressType;
		await this.refreshWallet({});
	}

	/**
	 * Refreshes/Syncs the wallet data.
	 * @param {boolean} scanAllAddresses
	 * @param {boolean} updateAllAddressTypes
	 * @returns {Promise<Result<IWalletData>>}
	 */
	public async refreshWallet({
		scanAllAddresses = false,
		updateAllAddressTypes = false
	} = {}): Promise<Result<IWalletData>> {
		try {
			await this.setZeroIndexAddresses();
			const addressType: undefined | EAddressType = updateAllAddressTypes
				? undefined
				: this.addressType;
			const r1 = await this.updateAddressIndexes({ addressType });
			if (r1.isErr()) return err(r1.error.message);
			const r2 = await this.getUtxos({ scanAllAddresses });
			if (r2.isErr()) return err(r2.error.message);
			const r3 = await this.updateTransactions({ scanAllAddresses });
			if (r3.isErr()) return err(r3.error.message);
			await this.electrum.subscribeToAddresses();
			return ok(this.data);
		} catch (e) {
			// @ts-ignore
			return err(e);
		}
	}

	/**
	 * Sets the wallet data object.
	 * @returns {Promise<Result<boolean>>}
	 * @private
	 */
	private async setWalletData(): Promise<Result<boolean>> {
		this.data = getDefaultWalletData();
		const walletDataResponse = await this.getWalletData();
		if (walletDataResponse.isErr())
			return err(walletDataResponse.error.message);
		this.data = walletDataResponse.value;
		return ok(true);
	}

	/**
	 * Returns the key used for storing wallet data in the key/value pair.
	 * @returns {string}
	 * @param key
	 */
	private getWalletDataKey(key: keyof IWalletData): string {
		return `${this.walletName}-${this.network}-${key}`;
	}

	/**
	 * Gets the wallet data object from storge if able.
	 * Otherwise, it falls back to the default wallet data object.
	 * @returns {Promise<Result<IWalletData>>}
	 */
	public async getWalletData(): Promise<Result<IWalletData>> {
		const walletDataKeys = getDefaultWalletDataKeys();
		const walletData: IWalletData = getDefaultWalletData();
		for (const key of walletDataKeys) {
			let dataResult;
			try {
				const walletDataKey = this.getWalletDataKey(key);
				dataResult = await this.getData(walletDataKey);
				if (dataResult.isErr()) return err(dataResult.error.message);
			} catch (e) {
				return err('Unable to get wallet data.');
			}
			const data = dataResult?.value ?? walletData[key];
			switch (key) {
				case 'addressType':
					walletData[key] = data as EAddressType;
					break;
				case 'addresses':
				case 'changeAddresses':
					walletData[key] = data as TAddressTypeContent<IAddresses>;
					break;
				case 'addressIndex':
				case 'changeAddressIndex':
					walletData[key] = data as TAddressTypeContent<IAddress>;
					break;
				case 'lastUsedAddressIndex':
				case 'lastUsedChangeAddressIndex':
					walletData[key] = data as TAddressTypeContent<IAddress>;
					break;
				case 'utxos':
					walletData[key] = data as IUtxo[];
					break;
				case 'blacklistedUtxos':
					walletData[key] = data as IUtxo[];
					break;
				case 'unconfirmedTransactions':
				case 'transactions':
					walletData[key] = data as IFormattedTransactions;
					break;
				case 'transaction':
					walletData[key] = data as ISendTransaction;
					break;
				case 'balance':
					walletData[key] = data as number;
					break;
				case 'exchangeRates':
					walletData[key] = data as IExchangeRates;
					break;
				case 'header':
					walletData[key] = data as IHeader;
					break;
				case 'boostedTransactions':
					walletData[key] = data as IBoostedTransactions;
					break;
				default:
					return err(`Unhandled key in getWalletData: ${key}`);
			}
		}
		return ok(walletData);
	}

	/**
	 * Returns the Network object of the currently selected network (bitcoin or testnet).
	 * @param {TAvailableNetworks} [network]
	 * @returns {Network}
	 */
	private getBitcoinNetwork(network?: TAvailableNetworks): Network {
		if (!network) network = this.network;
		return bitcoin.networks[network];
	}

	/**
	 * Ensures the provided mnemonic matches the one stored in the wallet and is valid.
	 * @param mnemonic
	 * @returns {boolean}
	 */
	isValid(mnemonic): boolean {
		return mnemonic === this.mnemonic && validateMnemonic(mnemonic);
	}

	/**
	 * Returns the address for the specified path and address type.
	 * @param {string} path
	 * @param {EAddressType} addressType
	 * @returns {IGetAddressResponse}
	 * @private
	 */
	private async _getAddress(
		path: string,
		addressType: EAddressType
	): Promise<IGetAddressResponse> {
		if (this.customGetAddress) {
			const data = {
				path,
				type: addressType,
				selectedNetwork: this.electrum.getElectrumNetwork(this.network)
			};
			const res = await this.customGetAddress(data);
			if (res.isErr()) {
				return {
					address: '',
					path,
					publicKey: ''
				};
			}
			return res.value;
		}
		const keyPair = this.root.derivePath(path);
		let address;
		switch (addressType) {
			case EAddressType.p2wpkh:
				//Get Bech32 (bc1) address
				address =
					bitcoin.payments.p2wpkh({
						pubkey: keyPair.publicKey,
						network: this.getBitcoinNetwork()
					}).address ?? '';
				break;
			case EAddressType.p2sh:
				//Get Segwit P2SH Address (3)
				address =
					bitcoin.payments.p2sh({
						redeem: bitcoin.payments.p2wpkh({
							pubkey: keyPair.publicKey,
							network: this.getBitcoinNetwork()
						}),
						network: this.getBitcoinNetwork()
					}).address ?? '';
				break;
			//Get Legacy Address (1)
			case EAddressType.p2pkh:
				address =
					bitcoin.payments.p2pkh({
						pubkey: keyPair.publicKey,
						network: this.getBitcoinNetwork()
					}).address ?? '';
				break;
		}
		return {
			address,
			path,
			publicKey: keyPair.publicKey.toString('hex')
		};
	}

	/**
	 * Returns a single Bitcoin address based on the provided address type,
	 * index and whether it is a change address.
	 * @param {TKeyDerivationIndex} [index]
	 * @param {boolean} [changeAddress]
	 * @param {EAddressType} [addressType]
	 * @returns {string}
	 */
	public async getAddress({
		index,
		changeAddress = false,
		addressType = this.addressType
	}: IGetAddress = {}): Promise<string> {
		try {
			if (index === undefined) {
				const addressIndex = this.data.addressIndex[addressType];
				index = addressIndex.index >= 0 ? String(addressIndex.index) : '0';
			}
			const pathRes = getKeyDerivationPathString({
				addressType,
				changeAddress,
				index,
				network: this.network
			});
			if (pathRes.isErr()) {
				return '';
			}
			const path = pathRes.value;
			const res = await this._getAddress(path, addressType);
			if (!res?.address) return '';
			return res.address;
		} catch (e) {
			return '';
		}
	}

	/**
	 * Get address for a given keyPair, network and type.
	 * @param {string} path
	 * @param {EAddressType} addressType
	 * @returns {Promise<Result<string>>}
	 */
	public async getAddressByPath({
		path,
		addressType
	}: IGetAddressByPath): Promise<Result<IGetAddressResponse>> {
		if (!path) {
			return err('No path specified');
		}
		if (!addressType) {
			const res = getAddressTypeFromPath(path);
			if (res.isErr()) return err(res.error.message);
			addressType = res.value;
		}
		try {
			const getAddressRes = await this._getAddress(path, addressType);
			if (!getAddressRes?.address) return err('Unable to get address.');
			return ok(getAddressRes);
		} catch (e) {
			// @ts-ignore
			return err(e);
		}
	}

	/**
	 * Attempts to connect to the specified Electrum server(s).
	 * @param {TServer | TServer[]} servers
	 * @returns {Promise<Result<string>>}
	 */
	public async connectToElectrum(
		servers?: TServer | TServer[]
	): Promise<Result<string>> {
		const res = await this.electrum.connectToElectrum({
			network: this.network,
			servers: servers ?? this.electrumOptions?.servers
		});
		let msg = 'Unable to connect to Electrum server.';
		if (res.error) {
			console.log(msg);
			return err(msg);
		}
		msg = 'Connected to Electrum server.';
		return ok(msg);
	}

	/**
	 * Returns the address balance for the specified address.
	 * @param {string} address
	 * @returns {Promise<Result<IGetAddressBalanceRes>>}
	 */
	public async getAddressBalance(
		address: string
	): Promise<Result<IGetAddressBalanceRes>> {
		const scriptHash = await this.getScriptHash({
			address,
			network: this.network
		});
		const res = await this.electrum.getAddressBalance(scriptHash);
		if (res.error) return err('Unable to get address balance at this time.');
		return ok({ unconfirmed: res.unconfirmed, confirmed: res.confirmed });
	}

	/**
	 * Get scriptHash for a given address
	 * @param {string} address
	 * @param {EAvailableNetworks} network
	 * @returns {Promise<string>}
	 */
	public async getScriptHash({
		address,
		network
	}: {
		address: string;
		network: EAvailableNetworks;
	}): Promise<string> {
		if (this.customGetScriptHash) {
			const selectedNetwork = this.electrum.getElectrumNetwork(network);
			return await this.customGetScriptHash({ address, selectedNetwork });
		}
		return getScriptHash({ address, network });
	}

	/**
	 * Returns private key for the provided path.
	 * @param path
	 * @returns {string}
	 */
	getPrivateKey(path: string): string {
		const keyPair = this.root.derivePath(path);
		return keyPair.toWIF();
	}

	/**
	 * Returns the balance for the specified scriptHash.
	 * @param {string} scriptHash
	 * @returns {Promise<Result<IGetAddressBalanceRes>>}
	 */
	public async getScriptHashBalance(
		scriptHash: string
	): Promise<Result<IGetAddressBalanceRes>> {
		const res = await this.electrum.getAddressBalance(scriptHash);
		if (res.error) return err('Unable to get address balance at this time.');
		return ok({ unconfirmed: res.unconfirmed, confirmed: res.confirmed });
	}

	/**
	 * Returns the known balance from storage.
	 * @returns {number}
	 */
	public getBalance(): number {
		return this?.data?.balance ?? 0;
	}

	/**
	 * Generates a series of addresses based on the specified params.
	 * @async
	 * @param {string} selectedWallet - Wallet ID
	 * @param {number} [addressAmount] - Number of addresses to generate.
	 * @param {number} [changeAddressAmount] - Number of changeAddresses to generate.
	 * @param {number} [addressIndex] - What index to start generating addresses at.
	 * @param {number} [changeAddressIndex] - What index to start generating changeAddresses at.
	 * @param {string} [keyDerivationPath] - The path to generate addresses from.
	 * @param {string} [addressType] - Determines what type of address to generate (p2pkh, p2sh, p2wpkh).
	 * @returns {Promise<Result<IGenerateAddressesResponse>>}
	 */
	public async generateAddresses({
		addressAmount = 10,
		changeAddressAmount = 10,
		addressIndex = 0,
		changeAddressIndex = 0,
		keyDerivationPath,
		addressType = this.addressType
	}: IGenerateAddresses): Promise<Result<IGenerateAddressesResponse>> {
		const network = this.network;
		try {
			if (!keyDerivationPath) {
				// Set derivation path accordingly based on address type.
				const keyDerivationPathResponse = getKeyDerivationPath({
					network,
					addressType
				});
				if (keyDerivationPathResponse.isErr())
					return err(keyDerivationPathResponse.error.message);
				keyDerivationPath = keyDerivationPathResponse.value;
			}

			const addresses = {} as IAddresses;
			const changeAddresses = {} as IAddresses;
			const addressArray = new Array(addressAmount).fill(null);
			const changeAddressArray = new Array(changeAddressAmount).fill(null);

			await Promise.all(
				addressArray.map(async (_item, i) => {
					const index = i + addressIndex;
					const path = { ...keyDerivationPath };
					path.index = `${index}`;
					const addressPath = formatKeyDerivationPath({
						path,
						network,
						changeAddress: false,
						index: `${index}`
					});
					if (addressPath.isErr()) {
						throw addressPath.error;
					}
					const address = await this.getAddressByPath({
						path: addressPath.value.pathString
					});
					if (address.isErr()) {
						throw address.error;
					}
					const scriptHash = await this.getScriptHash({
						address: address.value.address,
						network: this.network
					});
					if (!scriptHash) {
						throw new Error('Unable to get script hash.');
					}
					addresses[scriptHash] = {
						...address.value,
						index,
						scriptHash
					};
				})
			);

			await Promise.all(
				changeAddressArray.map(async (_item, i) => {
					const index = i + changeAddressIndex;
					const path = { ...keyDerivationPath };
					path.index = `${index}`;
					const changeAddressPath = formatKeyDerivationPath({
						path,
						network,
						changeAddress: true,
						index: `${index}`
					});
					if (changeAddressPath.isErr()) {
						throw changeAddressPath.error;
					}

					const address = await this.getAddressByPath({
						path: changeAddressPath.value.pathString
					});
					if (address.isErr()) {
						throw address.error;
					}
					const scriptHash = await this.getScriptHash({
						address: address.value.address,
						network
					});
					if (!scriptHash) {
						throw new Error('Unable to get script hash.');
					}
					changeAddresses[scriptHash] = {
						...address.value,
						index,
						scriptHash
					};
				})
			);

			return ok({ addresses, changeAddresses });
		} catch (e) {
			// @ts-ignore
			return err(e);
		}
	}

	/**
	 * Ensures the connection to Electrum is still available.
	 * Will attempt to reconnect if not initially available.
	 * @returns {Promise<Result<string>>}
	 */
	public async checkElectrumConnection(): Promise<Result<string>> {
		const isConnected = this.electrum.connectedToElectrum;
		if (!isConnected) {
			return await this.connectToElectrum();
		}
		// Ensure we're connected by pinging the server.
		const pingRes = await this.electrum.isConnected();
		if (pingRes) return ok('Is connected to Electrum.Z');
		return err('Failed Electrum connection check.');
	}

	/**
	 * Returns the next available address for the given addresstype.
	 * @param {EAddressType} addressType
	 * @returns {Promise<Result<IGetNextAvailableAddressResponse>>}
	 */
	public async getNextAvailableAddress(
		addressType?: EAddressType
	): Promise<Result<IGetNextAvailableAddressResponse>> {
		const checkRes = await this.checkElectrumConnection();
		if (checkRes.isErr()) return err(checkRes.error.message);
		try {
			const network = this.network;
			addressType = addressType ?? this.addressType;
			const currentWallet = this.data;
			const { path } = addressTypes[addressType]; // Assuming addressTypes is globally defined.
			const result = formatKeyDerivationPath({ path, network });

			if (result.isErr()) {
				return err(result.error.message);
			}

			const { pathObject: keyDerivationPath } = result.value;

			//The currently known/stored address index.
			let addressIndex = currentWallet.addressIndex[addressType];
			let lastUsedAddressIndex =
				currentWallet.lastUsedAddressIndex[addressType];
			let changeAddressIndex = currentWallet.changeAddressIndex[addressType];
			let lastUsedChangeAddressIndex =
				currentWallet.lastUsedChangeAddressIndex[addressType];

			if (!addressIndex?.address) {
				const generatedAddresses = await this.generateAddresses({
					addressAmount: GENERATE_ADDRESS_AMOUNT,
					changeAddressAmount: 0,
					keyDerivationPath,
					addressType
				});
				if (generatedAddresses.isErr()) {
					return err(generatedAddresses.error);
				}
				const addresses = generatedAddresses.value.addresses;
				const sorted = Object.values(addresses).sort(
					(a, b) => a.index - b.index
				);
				addressIndex = sorted[0];
			}

			if (!changeAddressIndex?.address) {
				const generatedAddresses = await this.generateAddresses({
					addressAmount: 0,
					changeAddressAmount: GENERATE_ADDRESS_AMOUNT,
					keyDerivationPath,
					addressType
				});
				if (generatedAddresses.isErr()) {
					return err(generatedAddresses.error);
				}
				const addresses = generatedAddresses.value.changeAddresses;
				const sorted = Object.values(addresses).sort(
					(a, b) => a.index - b.index
				);
				changeAddressIndex = sorted[0];
			}

			let addresses: IAddresses = currentWallet.addresses[addressType];
			let changeAddresses: IAddresses =
				currentWallet.changeAddresses[addressType];

			//How many addresses/changeAddresses are currently stored
			const addressCount = Object.values(addresses).length;
			const changeAddressCount = Object.values(changeAddresses).length;

			/*
			 *	Create more addresses if less than the default GENERATE_ADDRESS_AMOUNT or the highest address index matches the current address count
			 */

			if (
				addressCount < GENERATE_ADDRESS_AMOUNT ||
				addressIndex.index === addressCount
			) {
				const newAddresses = await this.addAddresses({
					addressAmount: GENERATE_ADDRESS_AMOUNT,
					changeAddressAmount: 0,
					addressIndex: addressIndex.index,
					changeAddressIndex: 0,
					keyDerivationPath,
					addressType
				});
				if (newAddresses.isOk()) {
					addresses = newAddresses.value.addresses;
				}
			}

			/*
			 *	Create more change addresses if none exist or the highest change address index matches the current
			 *	change address count
			 */
			if (
				changeAddressCount < GENERATE_ADDRESS_AMOUNT ||
				changeAddressIndex.index === changeAddressCount
			) {
				const newChangeAddresses = await this.addAddresses({
					addressAmount: 0,
					changeAddressAmount: GENERATE_ADDRESS_AMOUNT,
					addressIndex: 0,
					changeAddressIndex: changeAddressIndex.index,
					keyDerivationPath,
					addressType
				});
				if (newChangeAddresses.isOk()) {
					changeAddresses = newChangeAddresses.value.changeAddresses;
				}
			}

			//Store all addresses that are to be searched and used in this method.
			let allAddresses = Object.values(addresses).filter(
				({ index }) => index >= addressIndex.index
			);

			let addressesToScan = allAddresses;

			//Store all change addresses that are to be searched and used in this method.
			let allChangeAddresses = Object.values(changeAddresses).filter(
				({ index }) => index >= changeAddressIndex.index
			);
			let changeAddressesToScan = allChangeAddresses;

			//Prep for batch request
			let combinedAddressesToScan = [
				...addressesToScan,
				...changeAddressesToScan
			];

			let foundLastUsedAddress = false;
			let foundLastUsedChangeAddress = false;
			let addressHasBeenUsed = false;
			let changeAddressHasBeenUsed = false;

			// If an error occurs, return last known/available indexes.
			const lastKnownIndexes = ok({
				addressIndex,
				lastUsedAddressIndex,
				changeAddressIndex,
				lastUsedChangeAddressIndex
			});

			while (!foundLastUsedAddress || !foundLastUsedChangeAddress) {
				//Check if transactions are pending in the mempool.
				const addressHistory = await this.electrum.getAddressHistory({
					scriptHashes: combinedAddressesToScan
				});

				if (addressHistory.isErr()) {
					console.log(addressHistory.error.message);
					return lastKnownIndexes;
				}

				const txHashes = addressHistory.value;

				const highestUsedIndex = getHighestUsedIndexFromTxHashes({
					txHashes,
					addresses,
					changeAddresses,
					addressIndex,
					changeAddressIndex
				});

				if (highestUsedIndex.isErr()) {
					console.log(highestUsedIndex.error.message);
					return lastKnownIndexes;
				}

				addressIndex = highestUsedIndex.value.addressIndex;
				changeAddressIndex = highestUsedIndex.value.changeAddressIndex;
				if (highestUsedIndex.value.foundAddressIndex) {
					addressHasBeenUsed = true;
				}
				if (highestUsedIndex.value.foundChangeAddressIndex) {
					changeAddressHasBeenUsed = true;
				}

				const highestStoredIndex = this.getHighestStoredAddressIndex({
					addressType
				});

				if (highestStoredIndex.isErr()) {
					console.log(highestStoredIndex.error.message);
					return lastKnownIndexes;
				}

				const {
					addressIndex: highestUsedAddressIndex,
					changeAddressIndex: highestUsedChangeAddressIndex
				} = highestUsedIndex.value;
				const {
					addressIndex: highestStoredAddressIndex,
					changeAddressIndex: highestStoredChangeAddressIndex
				} = highestStoredIndex.value;

				if (highestUsedAddressIndex.index < highestStoredAddressIndex.index) {
					foundLastUsedAddress = true;
				}

				if (
					highestUsedChangeAddressIndex.index <
					highestStoredChangeAddressIndex.index
				) {
					foundLastUsedChangeAddress = true;
				}

				if (foundLastUsedAddress && foundLastUsedChangeAddress) {
					//Increase index by one if the current index was found in a txHash or is greater than the previous index.
					let newAddressIndex = addressIndex.index;
					if (
						highestUsedAddressIndex.index > addressIndex.index ||
						addressHasBeenUsed
					) {
						const index = highestUsedAddressIndex.index;
						if (highestUsedAddressIndex && index >= 0) {
							lastUsedAddressIndex = highestUsedAddressIndex;
						}
						newAddressIndex = index >= 0 ? index + 1 : index;
					}

					let newChangeAddressIndex = changeAddressIndex.index;
					if (
						highestUsedChangeAddressIndex.index > changeAddressIndex.index ||
						changeAddressHasBeenUsed
					) {
						const index = highestUsedChangeAddressIndex.index;
						if (highestUsedChangeAddressIndex && index >= 0) {
							lastUsedChangeAddressIndex = highestUsedChangeAddressIndex;
						}
						newChangeAddressIndex = index >= 0 ? index + 1 : index;
					}

					//Find and return the new address index.
					const nextAvailableAddress = Object.values(allAddresses).find(
						({ index }) => index === newAddressIndex
					);
					//Find and return the new change address index.
					const nextAvailableChangeAddress = Object.values(
						allChangeAddresses
					).find(({ index }) => index === newChangeAddressIndex);
					if (!nextAvailableAddress || !nextAvailableChangeAddress) {
						return lastKnownIndexes;
					}
					return ok({
						addressIndex: nextAvailableAddress,
						lastUsedAddressIndex,
						changeAddressIndex: nextAvailableChangeAddress,
						lastUsedChangeAddressIndex
					});
				}

				//Create receiving addresses for the next round
				if (!foundLastUsedAddress) {
					const newAddresses = await this.addAddresses({
						addressAmount: GENERATE_ADDRESS_AMOUNT,
						changeAddressAmount: 0,
						addressIndex: highestStoredIndex.value.addressIndex.index,
						changeAddressIndex: 0,
						keyDerivationPath,
						addressType
					});
					if (newAddresses.isOk()) {
						addresses = newAddresses.value.addresses || {};
					}
				}
				//Create change addresses for the next round
				if (!foundLastUsedChangeAddress) {
					const newChangeAddresses = await this.addAddresses({
						addressAmount: 0,
						changeAddressAmount: GENERATE_ADDRESS_AMOUNT,
						addressIndex: 0,
						changeAddressIndex:
							highestStoredIndex.value.changeAddressIndex.index,
						keyDerivationPath,
						addressType
					});
					if (newChangeAddresses.isOk()) {
						changeAddresses = newChangeAddresses.value.changeAddresses || {};
					}
				}

				// Store newly created addresses to scan in the next round.
				addressesToScan = Object.values(addresses);
				changeAddressesToScan = Object.values(changeAddresses);
				combinedAddressesToScan = [
					...addressesToScan,
					...changeAddressesToScan
				];
				// Store the newly created addresses used for this method.
				allAddresses = [...allAddresses, ...addressesToScan];
				allChangeAddresses = [...allChangeAddresses, ...changeAddressesToScan];
			}

			return lastKnownIndexes;
		} catch (e) {
			console.log(e);

			// @ts-ignore
			return err(e);
		}
	}

	/**
	 * Returns the highest address and change address index stored in the app for the specified wallet and network.
	 * Retrives the highest stored address index for the provided address type.
	 * @param {EAddressType} addressType
	 * @returns {Result<{ addressIndex: IAddress; changeAddressIndex: IAddress }>}
	 */
	public getHighestStoredAddressIndex({
		addressType
	}: {
		addressType: EAddressType;
	}): Result<{
		addressIndex: IAddress;
		changeAddressIndex: IAddress;
	}> {
		try {
			const currentWallet = this.data;
			const addresses = currentWallet.addresses[addressType];
			const changeAddresses = currentWallet.changeAddresses[addressType];

			const addressIndex = Object.values(addresses).reduce((prev, current) => {
				return prev.index > current.index ? prev : current;
			});

			const changeAddressIndex = Object.values(changeAddresses).reduce(
				(prev, current) => (prev.index > current.index ? prev : current)
			);

			return ok({ addressIndex, changeAddressIndex });
		} catch (e) {
			// @ts-ignore
			return err(e);
		}
	}

	/**
	 * This method will generate addresses as specified and return an object of filtered addresses to ensure no duplicates are returned.
	 * @async
	 * @private
	 * @param {number} [addressAmount]
	 * @param {number} [changeAddressAmount]
	 * @param {number} [addressIndex]
	 * @param {number} [changeAddressIndex]
	 * @param {IKeyDerivationPath} [keyDerivationPath]
	 * @param {EAddressType} [addressType]
	 * @returns {Promise<Result<IGenerateAddressesResponse>>}
	 */
	private async addAddresses({
		addressAmount = 5,
		changeAddressAmount = 5,
		addressIndex = 0,
		changeAddressIndex = 0,
		addressType,
		keyDerivationPath
	}: IGenerateAddresses): Promise<Result<IGenerateAddressesResponse>> {
		if (!addressType) {
			addressType = this.addressType;
		}
		const { path, type } = addressTypes[addressType];
		if (!keyDerivationPath) {
			const keyDerivationPathResponse = getKeyDerivationPathObject({
				path
			});
			if (keyDerivationPathResponse.isErr()) {
				return err(keyDerivationPathResponse.error.message);
			}
			keyDerivationPath = keyDerivationPathResponse.value;
		}
		const generatedAddresses = await this.generateAddresses({
			addressAmount,
			changeAddressAmount,
			addressIndex,
			changeAddressIndex,
			keyDerivationPath,
			addressType: type
		});
		if (generatedAddresses.isErr()) {
			return err(generatedAddresses.error);
		}

		const removeDuplicateResponse = await this.removeDuplicateAddresses({
			addresses: generatedAddresses.value.addresses,
			changeAddresses: generatedAddresses.value.changeAddresses
		});
		if (removeDuplicateResponse.isErr()) {
			return err(removeDuplicateResponse.error.message);
		}

		const addresses = removeDuplicateResponse.value.addresses;
		const changeAddresses = removeDuplicateResponse.value.changeAddresses;
		if (Object.keys(addresses).length) {
			this.data.addresses[addressType] = {
				...this.data.addresses[addressType],
				...addresses
			};
			await this.saveWalletData('addresses', this.data.addresses);
		}
		if (Object.keys(changeAddresses).length) {
			this.data.changeAddresses[addressType] = {
				...this.data.changeAddresses[addressType],
				...changeAddresses
			};
			await this.saveWalletData('changeAddresses', this.data.changeAddresses);
		}

		return ok({ ...generatedAddresses.value, addressType: type });
	}

	/**
	 * This method will compare a set of specified addresses to the currently stored addresses and remove any duplicates.
	 * @private
	 * @async
	 * @param {IAddresses} addresses
	 * @param {IAddresses} changeAddresses
	 * @returns {Promise<Result<IGenerateAddressesResponse>>}
	 */
	private async removeDuplicateAddresses({
		addresses = {},
		changeAddresses = {}
	}: {
		addresses?: IAddresses;
		changeAddresses?: IAddresses;
	}): Promise<Result<IGenerateAddressesResponse>> {
		try {
			const currentWallet: IWalletData = this.data;
			const currentAddressTypeContent: TAddressTypeContent<IAddresses> =
				currentWallet.addresses;
			const currentChangeAddressTypeContent: TAddressTypeContent<IAddresses> =
				currentWallet.changeAddresses;

			//Remove any duplicate addresses.
			await Promise.all([
				objectKeys(currentAddressTypeContent).map(async (addressType) => {
					await Promise.all(
						objectKeys(addresses).map((scriptHash) => {
							if (scriptHash in currentAddressTypeContent[addressType]) {
								delete addresses[scriptHash];
							}
						})
					);
				}),

				objectKeys(currentChangeAddressTypeContent).map(async (addressType) => {
					await Promise.all(
						objectKeys(changeAddresses).map((scriptHash) => {
							if (scriptHash in currentChangeAddressTypeContent[addressType]) {
								delete changeAddresses[scriptHash];
							}
						})
					);
				})
			]);

			return ok({ addresses, changeAddresses });
		} catch (e) {
			// @ts-ignore
			return err(e);
		}
	}

	/**
	 * This method updates the next available (zero-balance) address & changeAddress index.
	 * @private
	 * @async
	 * @param {EAddressType} [addressType]
	 * @returns {string}
	 */
	private async updateAddressIndexes({
		addressType //If this param is left undefined it will update the indexes for all stored address types.
	}: {
		addressType?: EAddressType;
	} = {}): Promise<Result<string>> {
		const checkRes = await this.checkElectrumConnection();
		if (checkRes.isErr()) return err(checkRes.error.message);
		const currentWallet = this.data;

		let addressTypeKeys = Object.values(EAddressType);
		if (addressType) {
			addressTypeKeys = [addressType];
		}

		let updated = false;

		const promises = addressTypeKeys.map(async (addressTypeKey) => {
			const response = await this.getNextAvailableAddress(addressTypeKey);
			if (response.isErr()) {
				throw response.error;
			}
			const result = response.value;
			let addressIndex = currentWallet.addressIndex[addressTypeKey];
			let changeAddressIndex = currentWallet.changeAddressIndex[addressTypeKey];
			let lastUsedAddressIndex =
				currentWallet.lastUsedAddressIndex[addressTypeKey];
			let lastUsedChangeAddressIndex =
				currentWallet.lastUsedChangeAddressIndex[addressTypeKey];
			if (
				addressIndex.index < 0 ||
				changeAddressIndex.index < 0 ||
				result.addressIndex.index > addressIndex.index ||
				result.changeAddressIndex.index > changeAddressIndex.index ||
				result.lastUsedAddressIndex.index > lastUsedAddressIndex.index ||
				result.lastUsedChangeAddressIndex.index >
					lastUsedChangeAddressIndex?.index
			) {
				if (result.addressIndex) {
					addressIndex = result.addressIndex;
				}

				if (result.changeAddressIndex) {
					changeAddressIndex = result.changeAddressIndex;
				}

				if (result.lastUsedAddressIndex) {
					lastUsedAddressIndex = result.lastUsedAddressIndex;
				}

				if (result.lastUsedChangeAddressIndex) {
					lastUsedChangeAddressIndex = result.lastUsedChangeAddressIndex;
				}

				//Final check to ensure that both addresses and change addresses do not exceed the gap limit/scanning threshold.
				//If either does, we generate a new addresses and/or change address at +1 the last used index.
				const lastUsedIndex =
					lastUsedAddressIndex.index > 0 ? lastUsedAddressIndex.index : 0;
				const currentGap = Math.abs(addressIndex.index - lastUsedIndex);
				if (currentGap > GAP_LIMIT) {
					const excessAmount = currentGap - GAP_LIMIT;
					const newIndex = addressIndex.index - excessAmount;
					const _addressIndex = await this.generateAddresses({
						addressType: addressTypeKey,
						addressAmount: 1,
						changeAddressAmount: 0,
						addressIndex: newIndex
					});
					if (_addressIndex.isErr()) {
						return err(_addressIndex.error.message);
					}
					addressIndex = Object.values(_addressIndex.value.addresses)[0];
				}

				const lastUsedChangeIndex =
					lastUsedChangeAddressIndex.index > 0
						? lastUsedChangeAddressIndex.index
						: 0;
				const currentChangeAddressGap = Math.abs(
					changeAddressIndex.index - lastUsedChangeIndex
				);
				if (currentChangeAddressGap > GAP_LIMIT) {
					const excessAmount = currentGap - GAP_LIMIT;
					const newIndex = addressIndex.index - excessAmount;
					const _changeAddressIndex = await this.generateAddresses({
						addressType: addressTypeKey,
						addressAmount: 0,
						changeAddressAmount: 1,
						changeAddressIndex: newIndex
					});
					if (_changeAddressIndex.isErr()) {
						return err(_changeAddressIndex.error.message);
					}
					changeAddressIndex = Object.values(
						_changeAddressIndex.value.changeAddresses
					)[0];
				}

				this.data.addressIndex[addressTypeKey] = addressIndex;
				this.data.changeAddressIndex[addressTypeKey] = changeAddressIndex;
				this.data.lastUsedAddressIndex[addressTypeKey] = lastUsedAddressIndex;
				this.data.lastUsedChangeAddressIndex[addressTypeKey] =
					lastUsedChangeAddressIndex;
				await Promise.all([
					this.saveWalletData('addressIndex', this.data.addressIndex),
					this.saveWalletData(
						'changeAddressIndex',
						this.data.changeAddressIndex
					),
					this.saveWalletData(
						'lastUsedAddressIndex',
						this.data.lastUsedAddressIndex
					),
					this.saveWalletData(
						'lastUsedChangeAddressIndex',
						this.data.lastUsedChangeAddressIndex
					)
				]);
				updated = true;
			}
		});
		try {
			await Promise.all(promises);
			return ok(
				updated ? 'Successfully updated indexes.' : 'No update needed.'
			);
		} catch (e) {
			// @ts-ignore
			return err(e);
		}
	}

	/**
	 * Resets address indexes back to the app's default/original state.
	 * @private
	 * @returns {void}
	 */
	private async resetAddressIndexes(): Promise<void> {
		const addressTypeKeys = Object.values(EAddressType);
		const defaultWalletShape = getDefaultWalletData();
		for (const addressType of addressTypeKeys) {
			this.data.addressIndex[addressType] =
				defaultWalletShape.addressIndex[addressType];
			this.data.changeAddressIndex[addressType] =
				defaultWalletShape.changeAddressIndex[addressType];
			this.data.lastUsedAddressIndex[addressType] =
				defaultWalletShape.lastUsedAddressIndex[addressType];
			this.data.lastUsedChangeAddressIndex[addressType] =
				defaultWalletShape.lastUsedChangeAddressIndex[addressType];
		}
		await Promise.all([
			this.saveWalletData('addressIndex', this.data.addressIndex),
			this.saveWalletData('changeAddressIndex', this.data.changeAddressIndex),
			this.saveWalletData(
				'lastUsedAddressIndex',
				this.data.lastUsedAddressIndex
			),
			this.saveWalletData(
				'lastUsedChangeAddressIndex',
				this.data.lastUsedChangeAddressIndex
			)
		]);
	}

	/**
	 * Generate a new receive address for the provided addresstype up to the set gap limit.
	 * @async
	 * @param {EAddressType} addressType
	 * @param {IKeyDerivationPath} keyDerivationPath
	 * @returns {Promise<Result<IAddress>>}
	 */
	public async generateNewReceiveAddress({
		addressType = this.addressType,
		keyDerivationPath
	}: {
		addressType?: EAddressType;
		keyDerivationPath?: IKeyDerivationPath;
	}): Promise<Result<IAddress>> {
		try {
			const network = this.network;
			const currentWallet = this.data;

			const getGapLimitResponse = this.getGapLimit({
				addressType
			});
			if (getGapLimitResponse.isErr()) {
				return err(getGapLimitResponse.error.message);
			}
			const { addressDelta } = getGapLimitResponse.value;

			// If the address delta exceeds the default gap limit, only return the current address index.
			if (addressDelta >= GAP_LIMIT) {
				const addressIndex = currentWallet.addressIndex;
				const receiveAddress = addressIndex[addressType];
				return ok(receiveAddress);
			}

			const { path } = addressTypes[addressType];
			if (!keyDerivationPath) {
				const keyDerivationPathResponse = getKeyDerivationPathObject({
					network,
					path
				});
				if (keyDerivationPathResponse.isErr()) {
					return err(keyDerivationPathResponse.error.message);
				}
				keyDerivationPath = keyDerivationPathResponse.value;
			}
			const addresses: IAddresses = currentWallet.addresses[addressType];
			const currentAddressIndex: number =
				currentWallet.addressIndex[addressType].index;
			const nextAddressIndex = Object.values(addresses).find((address) => {
				return address.index === currentAddressIndex + 1;
			});

			// Check if the next address index already exists or if it needs to be generated.
			if (nextAddressIndex) {
				// Update addressIndex and return the address content.
				this.data.addressIndex[addressType] = nextAddressIndex;
				await Promise.all([
					// @ts-ignore
					this.saveWalletData('addressIndex', this.data.addressIndex)
				]);
				return ok(nextAddressIndex);
			}

			// We need to generate, save and return the new address.
			const addAddressesRes = await this.addAddresses({
				addressAmount: 1,
				changeAddressAmount: 0,
				addressIndex: currentAddressIndex + 1,
				changeAddressIndex: 0,
				keyDerivationPath,
				addressType
			});
			if (addAddressesRes.isErr()) {
				return err(addAddressesRes.error.message);
			}
			const addressKeys = Object.keys(addAddressesRes.value.addresses);
			// If for any reason the phone was unable to generate the new address, return error.
			if (!addressKeys.length) {
				return err('Unable to generate addresses at this time.');
			}
			const newAddressIndex: IAddress =
				addAddressesRes.value.addresses[addressKeys[0]];
			this.data.addressIndex[addressType] = newAddressIndex;

			// @ts-ignore
			await this.saveWalletData('addressIndex', this.data.addressIndex);
			return ok(newAddressIndex);
		} catch (e) {
			console.log(e);
			// @ts-ignore
			return err(e);
		}
	}

	/**
	 * Returns the difference between the current address index and the last used address index.
	 * @private
	 * @param {EAddressType} [addressType]
	 * @returns {Result<{ addressDelta: number; changeAddressDelta: number }>}
	 */
	private getGapLimit({
		addressType
	}: {
		addressType?: EAddressType;
	}): Result<{ addressDelta: number; changeAddressDelta: number }> {
		try {
			if (!addressType) {
				addressType = this.addressType;
			}
			const currentWallet = this.data;
			const addressIndex = currentWallet.addressIndex[addressType].index;
			const lastUsedAddressIndex =
				currentWallet.lastUsedAddressIndex[addressType].index;
			const changeAddressIndex =
				currentWallet.changeAddressIndex[addressType].index;
			const lastUsedChangeAddressIndex =
				currentWallet.lastUsedChangeAddressIndex[addressType].index;
			const addressDelta = Math.abs(
				addressIndex - (lastUsedAddressIndex > 0 ? lastUsedAddressIndex : 0)
			);
			const changeAddressDelta = Math.abs(
				changeAddressIndex -
					(lastUsedChangeAddressIndex > 0 ? lastUsedChangeAddressIndex : 0)
			);

			return ok({ addressDelta, changeAddressDelta });
		} catch (e) {
			console.log(e);
			// @ts-ignore
			return err(e);
		}
	}

	/**
	 * Retrieves and sets UTXO's for the current wallet from Electrum.
	 * @param {boolean} scanAllAddresses
	 * @returns {Promise<Result<IGetUtxosResponse>>}
	 */
	public async getUtxos({
		scanAllAddresses = false
	}): Promise<Result<IGetUtxosResponse>> {
		const checkRes = await this.checkElectrumConnection();
		if (checkRes.isErr()) return err(checkRes.error.message);
		const getUtxosRes = await this.electrum.getUtxos({ scanAllAddresses });
		if (getUtxosRes.isErr()) {
			return err(getUtxosRes.error.message);
		}
		const utxos = getUtxosRes.value.utxos;
		const balance = getUtxosRes.value.balance;
		this.data.utxos = utxos;
		this.data.balance = balance;
		await Promise.all([
			this.saveWalletData('utxos', this.data.utxos),
			this.saveWalletData('balance', this.data.balance)
		]);
		return ok({ utxos, balance });
	}

	/**
	 * Returns the current wallet's UTXO's from storage.
	 * @returns {IUtxo[]}
	 */
	listUtxos(): IUtxo[] {
		return this.data.utxos;
	}

	/**
	 * Saves the wallet data object to storage if able.
	 * @private
	 * @async
	 * @param {TWalletDataKeys} key
	 * @param {IWalletData[K]} data
	 * @returns {Promise<void>}
	 */
	private async saveWalletData<K extends keyof IWalletData>(
		key: TWalletDataKeys,
		data: IWalletData[K]
	): Promise<void> {
		if (!this.setData) return;
		const walletDataKey = this.getWalletDataKey(key);
		await this.setData(walletDataKey, data);
	}

	//TODO: Implement this as a way to better update and save state so we can consolidate this.data[key] updates.

	// @ts-ignore
	private async updateAndSaveWalletData(
		key: TWalletDataKeys,
		data: IWalletData,
		addressType?: EAddressType
	): Promise<void> {
		if (addressType) {
			this.data[key][addressType] = data;
			await this.saveWalletData(key, this.data[key]);
		} else {
			// @ts-ignore
			this.data[key] = data;
			await this.saveWalletData(key, this.data[key]);
		}
	}

	/**
	 * Retrieves, formats & stores the transaction history for the selected wallet/network.
	 * @param {boolean} [scanAllAddresses]
	 * @param {boolean} [replaceStoredTransactions] Setting this to true will set scanAllAddresses to true as well.
	 * @returns {Promise<Result<string | undefined>>}
	 */
	private async updateTransactions({
		scanAllAddresses = false,
		replaceStoredTransactions = false
	}: {
		scanAllAddresses?: boolean;
		replaceStoredTransactions?: boolean;
	}): Promise<Result<string | undefined>> {
		//Check existing unconfirmed transactions and remove any that are confirmed.
		//If the tx is reorg'd or bumped from the mempool and no longer exists, the transaction will be removed from the store and updated in the activity list.
		await this.checkUnconfirmedTransactions();

		const history = await this.electrum.getAddressHistory({
			scanAllAddresses: scanAllAddresses || replaceStoredTransactions
		});
		if (history.isErr()) {
			return err(history.error.message);
		}
		if (!history.value.length) {
			return ok(undefined);
		}

		const getTransactionsResponse = await this.electrum.getTransactions({
			txHashes: history.value
		});
		if (getTransactionsResponse.isErr()) {
			return err(getTransactionsResponse.error.message);
		}

		const formatTransactionsResponse = await this.formatTransactions({
			transactions: getTransactionsResponse.value.data
		});
		if (formatTransactionsResponse.isErr()) {
			return err(formatTransactionsResponse.error.message);
		}
		const transactions = formatTransactionsResponse.value;

		// Add unconfirmed transactions.
		// No need to wait for this to finish.
		this.addUnconfirmedTransactions({
			transactions
		});

		if (replaceStoredTransactions) {
			// No need to check the existing txs. Update with the returned formatTransactionsResponse.
			this.data.transactions = transactions;
			await this.saveWalletData('transactions', this.data.transactions);
			return ok(undefined);
		}

		// Handle new or updated transactions.
		const formattedTransactions: IFormattedTransactions = {};

		let notificationTxid: string | undefined;
		const storedTransactions = this.data.transactions;

		Object.keys(transactions).forEach((txid) => {
			//If the tx is new or the tx now has a block height (state changed to confirmed)
			if (
				!storedTransactions[txid] ||
				storedTransactions[txid].height !== transactions[txid].height
			) {
				formattedTransactions[txid] = {
					...transactions[txid],
					// Keep the previous timestamp if the tx is not new.
					timestamp:
						storedTransactions[txid]?.timestamp ??
						transactions[txid]?.timestamp ??
						Date.now()
				};
			}

			// if the tx is new, incoming but not from a transfer - show notification
			if (
				!storedTransactions[txid] &&
				transactions[txid].type === EPaymentType.received
			) {
				notificationTxid = txid;
			}
		});

		//No new or updated transactions
		if (!Object.keys(formattedTransactions).length) {
			return ok(undefined);
		}

		this.data.transactions = {
			...this.data.transactions,
			...formattedTransactions
		};
		await this.saveWalletData('transactions', this.data.transactions);
		return ok(notificationTxid);
	}

	/**
	 * Checks existing unconfirmed transactions that have been received and removes any that have >= 6 confirmations.
	 * If the tx is reorg'd or bumped from the mempool and no longer exists, the transaction
	 * will be removed from the store and updated in the activity list.
	 * @private
	 * @async
	 * @returns {Promise<Result<string>>}
	 */
	private async checkUnconfirmedTransactions(): Promise<Result<string>> {
		try {
			const processRes = await this.processUnconfirmedTransactions();
			if (processRes.isErr()) {
				return err(processRes.error.message);
			}

			const { unconfirmedTxs, outdatedTxs, ghostTxs } = processRes.value;
			if (outdatedTxs.length) {
				if (this.onMessage) this.onMessage('reorg', outdatedTxs);
				//We need to update the height of the transactions that were reorg'd out.
				await this.updateTransactionHeights(outdatedTxs);
			}
			if (ghostTxs.length) {
				if (this.onMessage) this.onMessage('rbf', ghostTxs);
				//We need to update the ghost transactions in the store & activity-list and rescan the addresses to get the correct balance.
				await this.updateGhostTransactions({
					txIds: ghostTxs
				});
			}
			this.data.unconfirmedTransactions = unconfirmedTxs;
			await Promise.all([
				this.saveWalletData(
					'unconfirmedTransactions',

					// @ts-ignore
					this.data.unconfirmedTransactions
				)
			]);
			return ok('Successfully updated unconfirmed transactions.');
		} catch (e) {
			// @ts-ignore
			return err(e);
		}
	}

	/**
	 * This method processes all transactions with less than 6 confirmations and returns the following:
	 * 1. Transactions that still have less than 6 confirmations and can be considered unconfirmed. (unconfirmedTxs)
	 * 2. Transactions that have fewer confirmations than before due to a reorg. (outdatedTxs)
	 * 3. Transactions that have been removed from the mempool. (ghostTxs)
	 * @private
	 * @async
	 * @returns {Promise<Result<TProcessUnconfirmedTransactions>>
	 */
	private async processUnconfirmedTransactions(): Promise<
		Result<TProcessUnconfirmedTransactions>
	> {
		try {
			//Retrieve all unconfirmed transactions (tx less than 6 confirmations in this case) from the store
			const oldUnconfirmedTxs = this.getUnconfirmedTransactions();

			//Use electrum to check if the transaction was removed/bumped from the mempool or if it still exists.
			const tx_hashes: ITxHash[] = Object.values(oldUnconfirmedTxs).map(
				(transaction: IFormattedTransaction) => {
					return { tx_hash: transaction.txid };
				}
			);
			const txs = await this.electrum.getTransactions({
				txHashes: tx_hashes
			});
			if (txs.isErr()) {
				return err(txs.error);
			}

			const unconfirmedTxs: IFormattedTransactions = {};
			const outdatedTxs: IUtxo[] = []; //Transactions that have been pushed back into the mempool due to a reorg. We need to update the height.
			const ghostTxs: string[] = []; //Transactions that have been removed from the mempool and are no longer in the blockchain.
			txs.value.data.forEach((txData: ITransaction<IUtxo>) => {
				// Check if the transaction has been removed from the mempool/still exists.
				if (!this.electrum.transactionExists(txData)) {
					//Transaction may have been removed/bumped from the mempool or potentially reorg'd out.
					ghostTxs.push(txData.data.tx_hash);
					return;
				}

				const newHeight = this.confirmationsToBlockHeight({
					confirmations: txData.result?.confirmations ?? 0
				});

				if (!txData.result?.confirmations) {
					const oldHeight = oldUnconfirmedTxs[txData.data.tx_hash]?.height ?? 0;
					if (oldHeight > newHeight) {
						//Transaction was reorg'd back to zero confirmations. Add it to the outdatedTxs array.
						outdatedTxs.push(txData.data);
					}
					unconfirmedTxs[txData.data.tx_hash] = {
						...oldUnconfirmedTxs[txData.data.tx_hash],
						height: newHeight
					};
					return;
				}

				//Check if the transaction has been confirmed.
				if (txData.result?.confirmations < 6) {
					unconfirmedTxs[txData.data.tx_hash] = {
						...oldUnconfirmedTxs[txData.data.tx_hash],
						height: newHeight
					};
				}
			});
			return ok({
				unconfirmedTxs,
				outdatedTxs,
				ghostTxs
			});
		} catch (e) {
			// @ts-ignore
			return err(e);
		}
	}

	/**
	 * Returns the current wallet's unconfirmed transactions from storage.
	 * @returns {Promise<Result<IFormattedTransactions>>}
	 */
	public getUnconfirmedTransactions(): IFormattedTransactions {
		const currentWallet = this.data;
		return currentWallet?.unconfirmedTransactions ?? {};
	}

	/**
	 * Returns the block height for a given number of confirmations from storage.
	 * @param {number} confirmations
	 * @param {number} [currentHeight]
	 * @param {TAvailableNetworks} [selectedNetwork]
	 * @returns {number}
	 */
	public confirmationsToBlockHeight({
		confirmations,
		currentHeight
	}: {
		confirmations: number;
		currentHeight?: number;
	}): number {
		if (!currentHeight) {
			const header = this.data.header;
			currentHeight = header.height;
		}
		if (confirmations > currentHeight) {
			return 0;
		}
		return currentHeight - confirmations;
	}

	/**
	 * Removes transactions from the store and activity list.
	 * @private
	 * @async
	 * @param {string[]} txIds
	 * @returns {Promise<Result<string>>}
	 */
	private async updateGhostTransactions({
		txIds
	}: {
		txIds: string[];
	}): Promise<Result<string>> {
		try {
			const transactions = this.data.transactions;
			const unconfirmedTransactions = this.data.unconfirmedTransactions;

			txIds.forEach((txId) => {
				if (txId in transactions) {
					transactions[txId]['exists'] = false;
				}
				if (txId in unconfirmedTransactions) {
					delete unconfirmedTransactions[txId];
				}
			});
			await this.saveWalletData('transactions', transactions);
			await this.saveWalletData(
				'unconfirmedTransactions',
				unconfirmedTransactions
			);

			//Rescan the addresses to get the correct balance.
			await this.rescanAddresses({
				shouldClearAddresses: false // No need to clear addresses since we are only updating the balance.
			});
			return ok('Successfully deleted transactions.');
		} catch (e) {
			// @ts-ignore
			return err(e);
		}
	}

	/**
	 * This method will clear the utxo array for each address type and reset the
	 * address indexes back to the original/default app values. Once cleared & reset
	 * the app will rescan the wallet's addresses from index zero.
	 * @async
	 * @param {boolean} [shouldClearAddresses] - Clears and re-generates all addresses when true.
	 * @param shouldClearTransactions
	 * @returns {Promise<Result<string>>}
	 */
	public async rescanAddresses({
		shouldClearAddresses = true, // It's assumed we want to clear addresses in this method unless explicitly set to false.
		shouldClearTransactions = false // We'll lose some timestamp information about the transactions if we clear them. So it's set to false by default.
	}: {
		shouldClearAddresses?: boolean;
		shouldClearTransactions?: boolean;
	}): Promise<Result<IWalletData>> {
		if (shouldClearAddresses) {
			await this.clearAddresses();
		}
		if (shouldClearTransactions) {
			await this.clearTransactions();
		}
		await this.clearUtxos();
		await this.resetAddressIndexes();
		// Wait to generate our zero index addresses.
		await this.setZeroIndexAddresses();
		return await this.refreshWallet({
			scanAllAddresses: true
		});
	}

	/**
	 * Clears the UTXO array and balance from storage.
	 * @private
	 * @async
	 * @returns {Promise<string>}
	 */
	private async clearUtxos(): Promise<string> {
		this.data.balance = 0;
		this.data.utxos = [];
		await Promise.all([
			this.saveWalletData('balance', this.data.balance),
			this.saveWalletData('utxos', this.data.utxos)
		]);
		return "Successfully cleared UTXO's.";
	}

	/**
	 * Clears the transactions object for a given wallet and network from storage.
	 * @private
	 * @returns {string}
	 */
	// @ts-ignore
	private async clearTransactions(): Promise<string> {
		this.data.transactions = getDefaultWalletData().transactions;
		await this.saveWalletData('transactions', this.data.transactions);
		return 'Successfully reset transactions.';
	}

	/**
	 * Clears the addresses and changeAddresses object for a given wallet and network.
	 * @private
	 * @async
	 * @returns {Promise<string>}
	 */
	private async clearAddresses(): Promise<string> {
		this.data.addresses = getAddressTypeContent<IAddresses>({});
		this.data.changeAddresses = getAddressTypeContent<IAddresses>({});
		await this.saveWalletData('addresses', this.data.addresses);
		await this.saveWalletData('changeAddresses', this.data.changeAddresses);
		return 'Successfully reset transactions.';
	}

	/**
	 * Updates the confirmation state of activity item transactions that were reorg'd out.
	 * @private
	 * @async
	 * @param {IUtxo[]} txs
	 * @returns {Promise<string>}
	 */
	private async updateTransactionHeights(txs: IUtxo[]): Promise<string> {
		let needsSave = false;
		txs.forEach((tx) => {
			const transactions = this.data.transactions;
			const txId = tx.tx_hash;
			if (txId in transactions) {
				transactions[txId].confirmTimestamp = 0;
				needsSave = true;
			}
		});
		if (needsSave) {
			// @ts-ignore
			await this.saveWalletData('transactions', this.data.transactions);
		}
		return 'Successfully updated reorg transactions.';
	}

	/**
	 * Parses and adds unconfirmed transactions to the store.
	 * @private
	 * @async
	 * @param {IFormattedTransactions} transactions
	 * @returns {Result<string>}
	 */
	private async addUnconfirmedTransactions({
		transactions
	}: {
		transactions: IFormattedTransactions;
	}): Promise<Result<string>> {
		try {
			const unconfirmedTransactions: IFormattedTransactions = {};
			Object.keys(transactions).forEach((key) => {
				const confirmations = this.blockHeightToConfirmations({
					blockHeight: transactions[key].height
				});
				if (confirmations < 6) {
					unconfirmedTransactions[key] = transactions[key];
				}
			});

			if (!Object.keys(unconfirmedTransactions).length) {
				return ok('No unconfirmed transactions found.');
			}

			this.data.unconfirmedTransactions = {
				...this.data.unconfirmedTransactions,
				...unconfirmedTransactions
			};

			await this.saveWalletData(
				'unconfirmedTransactions',
				this.data.unconfirmedTransactions
			);
			return ok('Successfully updated unconfirmed transactions.');
		} catch (e) {
			console.log(e);
			// @ts-ignore
			return err(e);
		}
	}

	/**
	 * Returns the number of confirmations for a given block height.
	 * @param {number} height
	 * @param {number} [currentHeight]
	 * @returns {number}
	 */
	public blockHeightToConfirmations({
		blockHeight,
		currentHeight
	}: {
		blockHeight?: number;
		currentHeight?: number;
	}): number {
		if (!blockHeight) {
			return 0;
		}
		if (!currentHeight) {
			const header = this.electrum.getBlockHeader();
			currentHeight = header.height;
		}
		if (currentHeight < blockHeight) {
			return 0;
		}
		return currentHeight - blockHeight + 1;
	}

	/**
	 * Formats the provided transaction.
	 * @async
	 * @param {ITransaction<IUtxo>[]} transactions
	 * @returns {Promise<Result<IFormattedTransactions>>}
	 */
	public async formatTransactions({
		transactions
	}: {
		transactions: ITransaction<IUtxo>[];
	}): Promise<Result<IFormattedTransactions>> {
		if (transactions.length < 1) {
			return ok({});
		}
		const currentWallet = this.data;

		// Batch and pre-fetch input data.
		const inputs: { tx_hash: string; vout: number }[] = [];
		transactions.forEach(({ result }) => {
			if (result?.vin) {
				result.vin.forEach((v) =>
					inputs.push({ tx_hash: v.txid, vout: v.vout })
				);
			}
		});
		const inputDataResponse = await this.getInputData({
			inputs
		});
		if (inputDataResponse.isErr()) {
			return err(inputDataResponse.error.message);
		}
		const addressTypeKeys = Object.values(EAddressType);
		const inputData = inputDataResponse.value;
		const currentAddresses = currentWallet.addresses;
		const currentChangeAddresses = currentWallet.changeAddresses;

		let addresses = {} as IAddresses;
		let changeAddresses = {} as IAddresses;
		let rbf = false;

		addressTypeKeys.map((addressType) => {
			// Check if addresses of this type have been generated. If not, skip.
			if (Object.keys(currentAddresses[addressType])?.length > 0) {
				addresses = {
					...addresses,
					...currentAddresses[addressType]
				};
			}
			// Check if change addresses of this type have been generated. If not, skip.
			if (Object.keys(currentChangeAddresses[addressType])?.length > 0) {
				changeAddresses = {
					...changeAddresses,
					...currentChangeAddresses[addressType]
				};
			}
		});

		// Create combined address/change-address object for easier/faster reference later on.
		const combinedAddressObj: { [key: string]: IAddress } = {};
		[...Object.values(addresses), ...Object.values(changeAddresses)].map(
			(data) => {
				combinedAddressObj[data.address] = data;
			}
		);

		const formattedTransactions: IFormattedTransactions = {};
		transactions.map(async ({ data, result }) => {
			if (!result.txid) {
				return;
			}

			let totalInputValue = 0; // Total value of all inputs.
			let matchedInputValue = 0; // Total value of all inputs with addresses that belong to this wallet.
			let totalOutputValue = 0; // Total value of all outputs.
			let matchedOutputValue = 0; // Total value of all outputs with addresses that belong to this wallet.
			let messages: string[] = []; // Array of OP_RETURN messages.

			//Iterate over each input
			result.vin.map(({ txid, scriptSig, vout, sequence }) => {
				//Push any OP_RETURN messages to messages array
				try {
					const asm = scriptSig.asm;
					if (asm !== '' && asm.includes('OP_RETURN')) {
						const OpReturnMessages = decodeOpReturnMessage(asm);
						messages = messages.concat(OpReturnMessages);
					}
				} catch {}

				try {
					// Check if rbf was enabled for this transaction.
					if (sequence < 0xffffffff - 1) rbf = true;
				} catch {}

				const { addresses: _addresses, value } = inputData[`${txid}${vout}`];
				totalInputValue = totalInputValue + value;
				_addresses.map((address) => {
					if (address in combinedAddressObj) {
						matchedInputValue = matchedInputValue + value;
					}
				});
			});

			//Iterate over each output
			result.vout.map(({ scriptPubKey, value }) => {
				const _addresses = scriptPubKey.addresses
					? scriptPubKey.addresses
					: scriptPubKey.address
					? [scriptPubKey.address]
					: [];
				totalOutputValue = totalOutputValue + value;
				_addresses.map((address) => {
					if (address in combinedAddressObj) {
						matchedOutputValue = matchedOutputValue + value;
					}
				});
			});

			const txid = result.txid;
			const type =
				matchedInputValue > matchedOutputValue
					? EPaymentType.sent
					: EPaymentType.received;
			const totalMatchedValue = matchedOutputValue - matchedInputValue;
			const value = Number(totalMatchedValue.toFixed(8));
			const totalValue = totalInputValue - totalOutputValue;
			const fee = Number(Math.abs(totalValue).toFixed(8));
			const satsPerByte = btcToSats(fee) / result.vsize;
			const { address, height, scriptHash } = data;
			let timestamp = Date.now();
			let confirmTimestamp: number | undefined;

			if (height > 0 && result.blocktime) {
				confirmTimestamp = result.blocktime * 1000;
				//In the event we're recovering, set the older timestamp.
				if (confirmTimestamp < timestamp) {
					timestamp = confirmTimestamp;
				}
			}

			formattedTransactions[txid] = {
				address,
				height,
				scriptHash,
				totalInputValue,
				matchedInputValue,
				totalOutputValue,
				matchedOutputValue,
				fee,
				satsPerByte,
				type,
				value,
				txid,
				messages,
				timestamp,
				confirmTimestamp,
				vin: result.vin,
				rbf
			};
		});

		return ok(formattedTransactions);
	}

	/**
	 * Returns formatted input data from the inputs array.
	 * @async
	 * @param {{tx_hash: string, vout: number}[]} inputs
	 * @returns {Promise<Result<InputData>>}
	 */
	public async getInputData({
		inputs
	}: {
		inputs: { tx_hash: string; vout: number }[];
	}): Promise<Result<InputData>> {
		try {
			const inputData: InputData = {};

			for (let i = 0; i < inputs.length; i += CHUNK_LIMIT) {
				const chunk = inputs.slice(i, i + CHUNK_LIMIT);

				const getTransactionsResponse =
					await this.electrum.getTransactionsFromInputs({
						txHashes: chunk
					});
				if (getTransactionsResponse.isErr()) {
					return err(getTransactionsResponse.error.message);
				}
				getTransactionsResponse.value.data.map(({ data, result }) => {
					const vout = result.vout[data.vout];
					const addresses = vout.scriptPubKey.addresses
						? vout.scriptPubKey.addresses
						: vout.scriptPubKey.address
						? [vout.scriptPubKey.address]
						: [];
					const value = vout.value;
					const key = `${data.tx_hash}${vout.n}`;
					inputData[key] = { addresses, value };
				});
			}
			return ok(inputData);
		} catch (e) {
			// @ts-ignore
			return err(e);
		}
	}

	/**
	 * Returns exchange rate data from storage.
	 * @param {string} currency
	 * @returns {number}
	 */
	public getExchangeRate(currency = 'EUR'): number {
		try {
			if (currency in this.exchangeRates) {
				return this.exchangeRates[currency]?.rate ?? 0;
			}
			return 0;
		} catch {
			return 0;
		}
	}

	/**
	 * Attempts to validate a given address.
	 * @param {string} address
	 * @returns {boolean}
	 */
	public validateAddress(address: string): boolean {
		return validateAddress({ address, network: this.network }).isValid;
	}

	/**
	 * Retrieves the next available change address data.
	 * @async
	 * @returns {Promise<Result<IAddress>>}
	 */
	public async getChangeAddress(): Promise<Result<IAddress>> {
		const addressType = this.addressType;
		const currentWallet = this.data;

		const changeAddressIndexContent =
			currentWallet.changeAddressIndex[addressType];

		if (
			changeAddressIndexContent?.address &&
			changeAddressIndexContent.index >= 0
		) {
			return ok(changeAddressIndexContent);
		}

		// It's possible we haven't set the change address index yet. Generate one on the fly.
		const generateAddressResponse = await this.generateAddresses({
			addressAmount: 0,
			changeAddressAmount: 1,
			addressType
		});
		if (generateAddressResponse.isErr()) {
			console.log(generateAddressResponse.error.message);
			return err('Unable to successfully generate a change address.');
		}
		return ok(generateAddressResponse.value.changeAddresses[0]);
	}

	/**
	 * Returns the current fee estimates for the provided network.
	 * @async
	 * @returns {Promise<IFees>}
	 */
	public async getFeeEstimates(): Promise<IFees> {
		try {
			const network = this.network;

			if (network === EAvailableNetworks.bitcoinRegtest) {
				return {
					fast: 60,
					normal: 50,
					slow: 40,
					minimum: 30,
					timestamp: Date.now()
				};
			}

			const urlModifier = network === 'bitcoin' ? '' : 'testnet/';
			const response = await fetch(
				`https://mempool.space/${urlModifier}api/v1/fees/recommended`
			);
			const res: IGetFeeEstimatesResponse = await response.json();
			return {
				fast: res.fastestFee,
				normal: res.halfHourFee,
				slow: res.hourFee,
				minimum: res.minimumFee,
				timestamp: Date.now()
			};
		} catch {
			return defaultFeesShape;
		}
	}

	/**
	 * Sets up the transaction object with existing inputs and change address information
	 * @async.
	 * @param {ISetupTransaction} params
	 * @returns {TSetupTransactionResponse}
	 */
	public async setupTransaction(
		params: ISetupTransaction = {}
	): TSetupTransactionResponse {
		return await this.transaction.setupTransaction(params);
	}

	/**
	 * Sets up and creates a transaction to multiple outputs.
	 * @param {ISendTx[]} txs
	 * @param {number} satsPerByte
	 * @param {boolean} rbf
	 * @returns {Promise<Result<string>>}
	 */
	public async sendMany({
		txs = [],
		satsPerByte = this.feeEstimates.normal,
		rbf
	}: {
		txs: ISendTx[];
		satsPerByte?: number;
		rbf?: boolean;
	}): Promise<Result<string>> {
		const setupTransactionRes = await this.transaction.setupTransaction({
			rbf
		});
		if (setupTransactionRes.isErr()) {
			return err(setupTransactionRes.error.message);
		}

		if (!Array.isArray(txs)) txs = [txs];

		const shuffledTxs = shuffleArray(txs);
		let index = 0;
		for (const tx of shuffledTxs) {
			const updateSendTransactionRes =
				await this.transaction.updateSendTransaction({
					transaction: {
						label: tx.message,
						outputs: [{ address: tx.address, value: tx.amount, index }]
					}
				});
			if (updateSendTransactionRes.isErr())
				err(updateSendTransactionRes.error.message);
			index++;
		}

		await this.transaction.updateFee({ satsPerByte });

		const createRes = await this.transaction.createTransaction();
		if (createRes.isErr()) return err(createRes.error.message);
		const { hex } = createRes.value;
		const broadcastRes = await this.electrum.broadcastTransaction({
			rawTx: hex
		});
		if (broadcastRes.isErr()) return err(broadcastRes.error.message);
		return ok(broadcastRes.value);
	}

	/**
	 * Sets up and creates a transaction to a single output/recipient.
	 * @async
	 * @param {string} address
	 * @param {number} amount
	 * @param {string} message
	 * @param {number} satsPerByte
	 * @param {boolean} rbf
	 * @returns {Promise<Result<string>>}
	 */
	public async send({
		address,
		amount,
		message = '',
		satsPerByte = this.feeEstimates.normal,
		rbf
	}: {
		address: string;
		amount: number;
		message?: string;
		satsPerByte?: number;
		rbf?: boolean;
	}): Promise<Result<string>> {
		return await this.sendMany({
			txs: [{ address, amount, message }],
			satsPerByte,
			rbf
		});
	}

	/**
	 * Returns the address from a provided script hash in storage.
	 * @param {string} scriptHash
	 * @returns {IAddress | undefined}
	 */
	public getAddressFromScriptHash(scriptHash: string): IAddress | undefined {
		const addresses: TAddressTypeContent<IAddresses> = this.data.addresses;
		const changeAddresses: TAddressTypeContent<IAddresses> =
			this.data.changeAddresses;
		const combinedAddresses: IAddress[] = [
			...Object.values(addresses),
			...Object.values(changeAddresses)
		].flatMap((addressGroup: IAddresses) => Object.values(addressGroup));
		return combinedAddresses.find(
			(addressObj: IAddress) => addressObj.scriptHash === scriptHash
		);
	}

	/**
	 * Will ensure that both address and change address indexes are set at index 0.
	 * Will also generate and store address and changeAddress at index 0.
	 * @private
	 * @async
	 * @returns {Promise<Result<string>>}
	 */
	private async setZeroIndexAddresses(): Promise<Result<string>> {
		const types = Object.values(EAddressType);
		const currentWallet = this.data;

		for (const addressType of types) {
			const addressIndex = currentWallet.addressIndex[addressType];
			const changeAddressIndex = currentWallet.changeAddressIndex[addressType];

			if (addressIndex?.index >= 0 && changeAddressIndex?.index >= 0) {
				return ok('No need to set indexes.');
			}

			if (addressIndex?.index < 0) {
				const address = await this.addAddresses({
					addressAmount: GENERATE_ADDRESS_AMOUNT,
					addressIndex: 0,
					changeAddressAmount: 0,
					changeAddressIndex: 0,
					addressType
				});
				if (address.isOk()) {
					this.data.addressIndex[addressType] =
						address.value.addresses[Object.keys(address.value.addresses)[0]];
					await this.saveWalletData('addressIndex', this.data.addressIndex);
				}
			}
			if (changeAddressIndex?.index < 0) {
				const changeAddress = await this.addAddresses({
					addressAmount: 0,
					addressIndex: 0,
					changeAddressAmount: GENERATE_ADDRESS_AMOUNT,
					changeAddressIndex: 0,
					addressType
				});
				if (changeAddress.isOk()) {
					this.data.changeAddressIndex[addressType] =
						changeAddress.value.changeAddresses[
							Object.keys(changeAddress.value.changeAddresses)[0]
						];
					await this.saveWalletData(
						'changeAddressIndex',
						this.data.changeAddressIndex
					);
				}
			}
		}
		return ok('Set Zero Index Addresses.');
	}

	/**
	 * Returns current address index information.
	 * @returns {TAddressIndexInfo}
	 */
	public getAddressIndexInfo(): TAddressIndexInfo {
		const addressType = this.addressType;
		const currentWallet = this.data;
		const addressIndex = currentWallet.addressIndex[addressType];
		const changeAddressIndex = currentWallet.addressIndex[addressType];
		const lastUsedAddressIndex =
			currentWallet.lastUsedAddressIndex[addressType];
		const lastUsedChangeAddressIndex =
			currentWallet.lastUsedChangeAddressIndex[addressType];
		return {
			addressIndex,
			changeAddressIndex,
			lastUsedAddressIndex,
			lastUsedChangeAddressIndex
		};
	}

	/**
	 * Returns the next available receive address.
	 * @param {EAddressType} [addressType]
	 * @returns {Promise<Result<string>>}
	 */
	getReceiveAddress = async ({
		addressType
	}: {
		addressType?: EAddressType;
	}): Promise<Result<string>> => {
		try {
			if (!addressType) {
				addressType = this.addressType;
			}
			const wallet = this.data;
			const addressIndex = wallet.addressIndex;
			const receiveAddress = addressIndex[addressType].address;
			if (receiveAddress) {
				return ok(receiveAddress);
			}
			const addresses = wallet?.addresses[addressType];

			// Check if addresses were generated, but the index has not been set yet.
			if (
				Object.keys(addresses).length > 0 &&
				addressIndex[addressType].index < 0
			) {
				// Grab and return the address at index 0.
				const address = Object.values(addresses).find(
					({ index }) => index === 0
				);
				if (address) {
					return ok(address.address);
				}
			}
			// Fallback to generating a new receive address on the fly.
			const generatedAddress = await this.generateNewReceiveAddress({
				addressType
			});
			if (generatedAddress.isOk()) {
				return ok(generatedAddress.value.address);
			} else {
				console.log(generatedAddress.error.message);
			}
			return err('No receive address available.');
		} catch (e) {
			// @ts-ignore
			return err(e);
		}
	};

	/**
	 * Using a tx_hash this method will return the necessary data to create a
	 * replace-by-fee transaction for any 0-conf, RBF-enabled tx.
	 * @param {ITxHash} txHash
	 * @returns {Promise<Result<IRbfData>>}
	 */

	public async getRbfData({
		txHash
	}: {
		txHash: ITxHash;
	}): Promise<Result<IRbfData>> {
		const txResponse = await this.electrum.getTransactions({
			txHashes: [txHash]
		});
		if (txResponse.isErr()) {
			return err(txResponse.error.message);
		}
		const txData = txResponse.value.data;

		const wallet = this.data;
		const addressTypeKeys = objectKeys(EAddressType);
		const addresses = wallet.addresses;
		const changeAddresses = wallet.changeAddresses;

		let allAddresses = {} as IAddresses;
		let allChangeAddresses = {} as IAddresses;

		await Promise.all(
			addressTypeKeys.map((addressType) => {
				allAddresses = {
					...allAddresses,
					...addresses[addressType],
					...changeAddresses[addressType]
				};
				allChangeAddresses = {
					...allChangeAddresses,
					...changeAddresses[addressType]
				};
			})
		);

		let changeAddressData: IOutput = {
			address: '',
			value: 0,
			index: 0
		};
		const inputs: IUtxo[] = [];
		let address = '';
		let scriptHash = '';
		let path = '';
		let value = 0;
		const addressType = EAddressType.p2wpkh;
		const outputs: IOutput[] = [];
		let message = '';
		let inputTotal = 0;
		let outputTotal = 0;
		let fee = 0;

		const insAndOuts = await Promise.all(
			txData.map(({ result }) => {
				const vin = result.vin ?? [];
				const vout = result.vout ?? [];
				return { vins: vin, vouts: vout };
			})
		);
		const { vins, vouts } = insAndOuts[0];
		for (let i = 0; i < vins.length; i++) {
			try {
				const input = vins[i];
				const txId = input.txid;
				const tx = await this.electrum.getTransactions({
					txHashes: [{ tx_hash: txId }]
				});
				if (tx.isErr()) {
					return err(tx.error.message);
				}
				if (tx.value.data[0].data.height > 0) {
					return err('Transaction is already confirmed. Unable to RBF.');
				}
				const txVout = tx.value.data[0].result.vout[input.vout];
				if (txVout.scriptPubKey?.address) {
					address = txVout.scriptPubKey.address;
				} else if (
					txVout.scriptPubKey?.addresses &&
					txVout.scriptPubKey.addresses.length
				) {
					address = txVout.scriptPubKey.addresses[0];
				}
				if (!address) {
					continue;
				}
				scriptHash = getScriptHash({ address, network: this.network });
				// Check that we are in possession of this scriptHash.
				if (!(scriptHash in allAddresses)) {
					// This output did not come from us.
					continue;
				}
				path = allAddresses[scriptHash].path;
				value = btcToSats(txVout.value);
				inputs.push({
					tx_hash: input.txid,
					index: input.vout,
					tx_pos: input.vout,
					height: 0,
					address,
					scriptHash,
					path,
					value
				});
				if (value) {
					inputTotal = inputTotal + value;
				}
			} catch (e) {
				console.log(e);
			}
		}
		for (let i = 0; i < vouts.length; i++) {
			const vout = vouts[i];
			const voutValue = btcToSats(vout.value);
			if (vout.scriptPubKey?.addresses) {
				address = vout.scriptPubKey.addresses[0];
			} else if (vout.scriptPubKey?.address) {
				address = vout.scriptPubKey.address;
			} else {
				try {
					if (vout.scriptPubKey.asm.includes('OP_RETURN')) {
						message = decodeOpReturnMessage(vout.scriptPubKey.asm)[0] || '';
					}
				} catch (e) {}
			}
			if (!address) {
				continue;
			}
			const changeAddressScriptHash = await getScriptHash({
				address,
				network: this.network
			});

			// If the address scripthash matches one of our address scripthashes, add it accordingly. Otherwise, add it as another output.
			if (Object.keys(allAddresses).includes(changeAddressScriptHash)) {
				changeAddressData = {
					address,
					value: voutValue,
					index: i
				};
			}
			const index = outputs?.length ?? 0;
			outputs.push({
				address,
				value: voutValue,
				index
			});
			outputTotal = outputTotal + voutValue;
		}

		if (!changeAddressData?.address && outputs.length >= 2) {
			/*
			 * Unable to determine change address.
			 * Performing an RBF could divert funds from the incorrect output.
			 *
			 * It's very possible that this tx sent the max amount of sats to a foreign/unknown address.
			 * Instead of pulling sats from that output to accommodate the higher fee (reducing how much the recipient receives)
			 * suggest a CPFP transaction.
			 */
			return err('cpfp');
		}

		if (outputTotal > inputTotal) {
			return err('Outputs should not be greater than the inputs.');
		}
		fee = Math.abs(Number(inputTotal - outputTotal));

		return ok({
			changeAddress: changeAddressData.address,
			inputs,
			balance: inputTotal,
			outputs,
			fee,
			message,
			addressType,
			rbf: true
		});
	}

	/**
	 * Deletes a given on-chain transaction by id.
	 * @param {string} txid
	 */
	async deleteOnChainTransactionById({
		txid
	}: {
		txid: string;
	}): Promise<void> {
		if (txid in this.data.transactions) {
			delete this.data.transactions[txid];
		}
		await this.saveWalletData('transactions', this.data.transactions);
	}

	/**
	 * Sets "exists" to false for a given on-chain transaction id.
	 * @param {string} txid
	 */
	async addGhostTransaction({ txid }: { txid: string }): Promise<void> {
		if (txid in this.data.transactions) {
			this.data.transactions[txid].exists = false;
		}
		await this.saveWalletData('transactions', this.data.transactions);
	}

	/**
	 * Adds a boosted transaction id to the boostedTransactions object.
	 * @param {string} newTxId
	 * @param {string} oldTxId
	 * @param {EBoostType} [type]
	 * @param {number} fee
	 * @returns {Promise<Result<IBoostedTransaction>>}
	 */
	async addBoostedTransaction({
		newTxId,
		oldTxId,
		type = EBoostType.cpfp,
		fee
	}: {
		newTxId: string;
		oldTxId: string;
		type?: EBoostType;
		fee: number;
	}): Promise<Result<IBoostedTransaction>> {
		try {
			const boostedTransactions = this.data.boostedTransactions;
			const parentTransactions = this.getBoostedTransactionParents({
				txid: oldTxId,
				boostedTransactions
			});
			parentTransactions.push(oldTxId);
			const boostedTx: IBoostedTransaction = {
				parentTransactions: parentTransactions,
				childTransaction: newTxId,
				type,
				fee
			};
			const boostedTransaction: IBoostedTransactions = {
				[oldTxId]: boostedTx
			};
			this.data.boostedTransactions = {
				...this.data.boostedTransactions,
				...boostedTransaction
			};
			await this.saveWalletData(
				'boostedTransactions',
				this.data.boostedTransactions
			);
			return ok(boostedTx);
		} catch (e) {
			// @ts-ignore
			return err(e);
		}
	}

	/**
	 * Returns an array of parents for a boosted transaction id.
	 * @param {string} txid
	 * @param {IBoostedTransactions} [boostedTransactions]
	 * @returns {string[]}
	 */
	getBoostedTransactionParents = ({
		txid,
		boostedTransactions
	}: {
		txid: string;
		boostedTransactions?: IBoostedTransactions;
	}): string[] => {
		if (!boostedTransactions) {
			boostedTransactions = this.getBoostedTransactions();
		}
		const boostObj = Object.values(boostedTransactions).find((boostObject) => {
			return boostObject.childTransaction === txid;
		});

		return boostObj?.parentTransactions ?? [];
	};

	/**
	 * Returns boosted transactions object.
	 * @returns {IBoostedTransactions}
	 */
	getBoostedTransactions = (): IBoostedTransactions => {
		return this.data.boostedTransactions;
	};

	/**
	 * This completely resets the send transaction state.
	 * @returns {Promise<Result<string>>}
	 */
	async resetSendTransaction(): Promise<Result<string>> {
		this.transaction.data = getDefaultSendTransaction();
		await this.saveWalletData('transaction', this.transaction.data);
		return ok('Transaction reseted');
	}

	/**
	 * Returns an array of transactions that can be boosted with cpfp and rbf.
	 * @returns {{cpfp: IFormattedTransaction[], rbf: IFormattedTransaction[]}}
	 */
	getBoostableTransactions(): {
		cpfp: IFormattedTransaction[];
		rbf: IFormattedTransaction[];
	} {
		const cpfp: IFormattedTransaction[] = [];
		const rbf: IFormattedTransaction[] = [];
		Object.values(this.data.unconfirmedTransactions).map((tx) => {
			if (tx.rbf) rbf.push(tx);
			cpfp.push(tx); // All unconfirmed transactions can be cpfp'd.
		});
		return { cpfp, rbf };
	}
}
