import * as bitcoin from 'bitcoinjs-lib';
import { Network, networks } from 'bitcoinjs-lib';
import BIP32Factory, { BIP32Interface } from 'bip32';
import * as ecc from '@bitcoinerlab/secp256k1';
import {
	EAddressType,
	EAvailableNetworks,
	EBoostType,
	EFeeId,
	EPaymentType,
	EScanningStrategy,
	IAddress,
	IAddresses,
	IBoostedTransaction,
	IBoostedTransactions,
	IBtInfo,
	ICanBoostResponse,
	ICustomGetAddress,
	ICustomGetScriptHash,
	IFormattedTransaction,
	IFormattedTransactions,
	IGenerateAddresses,
	IGenerateAddressesResponse,
	IGetAddress,
	IGetAddressBalanceRes,
	IGetAddressByPath,
	IGetAddressesFromPrivateKey,
	IGetAddressResponse,
	IGetFeeEstimatesResponse,
	IGetNextAvailableAddressResponse,
	IGetUtxosResponse,
	IHeader,
	IKeyDerivationPath,
	InputData,
	IOnchainFees,
	IOutput,
	IPrivateKeyInfo,
	IRbfData,
	ISendTransaction,
	ISendTx,
	ISetupTransaction,
	ISweepPrivateKey,
	ISweepPrivateKeyRes,
	ITransaction,
	ITxHash,
	IUtxo,
	IVout,
	IWallet,
	IWalletData,
	Net,
	TAddressIndexInfo,
	TAddressTypeContent,
	TAvailableNetworks,
	TGapLimitOptions,
	TGetData,
	TGetTotalFeeObj,
	Tls,
	TMessageDataMap,
	TOnMessage,
	TProcessUnconfirmedTransactions,
	TServer,
	TSetData,
	TSetupTransactionResponse,
	TTransactionMessage,
	TTxDetails,
	TTxResult,
	TUnspentAddressScriptHashData,
	TWalletDataKeys
} from '../types';
import {
	decodeOpReturnMessage,
	err,
	filterAddressesObjForGapLimit,
	formatKeyDerivationPath,
	generateWalletId,
	getAddressesFromPrivateKey,
	getAddressFromKeyPair,
	getAddressIndexDiff,
	getAddressTypeFromPath,
	getDataFallback,
	getDefaultWalletData,
	getDefaultWalletDataKeys,
	getElectrumNetwork,
	getHighestUsedIndexFromTxHashes,
	getKeyDerivationPath,
	getKeyDerivationPathObject,
	getKeyDerivationPathString,
	getScriptHash,
	getSeed,
	getWalletDataStorageKey,
	isPositive,
	objectKeys,
	objectsMatch,
	ok,
	removeDustUtxos,
	Result,
	shuffleArray,
	validateAddress,
	validateMnemonic
} from '../utils';
import {
	addressTypes,
	defaultFeesShape,
	getAddressTypeContent,
	getAddressTypes
} from '../shapes';
import { Electrum } from '../electrum';
import { Transaction } from '../transaction';
import { GAP_LIMIT, GAP_LIMIT_CHANGE, TRANSACTION_DEFAULTS } from './constants';
import cloneDeep from 'lodash.clonedeep';
import { btcToSats } from '../utils/conversion';
import * as bip39 from 'bip39';

const bip32 = BIP32Factory(ecc);

export class Wallet {
	private _network: EAvailableNetworks;
	private readonly _mnemonic: string;
	private readonly _passphrase: string;
	private readonly _seed: Buffer;
	private readonly _root: BIP32Interface;
	private _data: IWalletData;
	private _getData: TGetData;
	private _setData?: TSetData;
	private _customGetAddress?: (
		data: ICustomGetAddress
	) => Promise<Result<IGetAddressResponse>>; // For use with Bitkit.
	private _customGetScriptHash?: (
		data: ICustomGetScriptHash
	) => Promise<string>; // For use with Bitkit.
	private _pendingRefreshPromises: Array<
		(result: Result<IWalletData>) => void
	> = [];
	private _disableMessagesOnCreate: boolean;

	public addressTypesToMonitor: EAddressType[];
	public isRefreshing: boolean;
	public isSwitchingNetworks: boolean;
	public readonly id: string;
	public readonly name: string;
	public electrumOptions?: {
		net: Net;
		tls: Tls;
		servers?: TServer | TServer[];
		batchLimit?: number; // Maximum number of requests to be sent in a single batch
		batchDelay?: number; // Delay (in milliseconds) between each batch of requests
	};
	public electrum: Electrum;
	public addressType: EAddressType;
	public sendMessage: TOnMessage;
	public transaction: Transaction;
	public feeEstimates: IOnchainFees;
	public rbf: boolean;
	public selectedFeeId: EFeeId;
	public disableMessages: boolean;
	public gapLimitOptions: TGapLimitOptions;
	private constructor({
		mnemonic,
		passphrase,
		name,
		network = EAvailableNetworks.mainnet,
		addressType = EAddressType.p2wpkh,
		storage,
		electrumOptions,
		onMessage = (): null => null,
		customGetAddress,
		customGetScriptHash,
		rbf = false,
		selectedFeeId = EFeeId.normal,
		disableMessages = false,
		disableMessagesOnCreate = false,
		addressTypesToMonitor = Object.values(EAddressType),
		gapLimitOptions = {
			lookBehind: GAP_LIMIT,
			lookAhead: GAP_LIMIT,
			lookBehindChange: GAP_LIMIT_CHANGE,
			lookAheadChange: GAP_LIMIT_CHANGE
		}
	}: IWallet) {
		if (!mnemonic) throw new Error('No mnemonic specified.');
		if (!validateMnemonic(mnemonic)) throw new Error('Invalid mnemonic.');
		if (name && name.includes('-'))
			throw new Error('Wallet name cannot include a hyphen (-).');
		this._network = network;
		this._mnemonic = mnemonic;
		this._passphrase = passphrase ?? '';
		this._seed = getSeed(this._mnemonic, this._passphrase);
		this._root = bip32.fromSeed(
			this._seed,
			this.getBitcoinNetwork(this._network)
		);
		this._data = getDefaultWalletData();
		this._getData = storage?.getData ?? getDataFallback;
		this._setData = storage?.setData;
		this._disableMessagesOnCreate = disableMessagesOnCreate;
		if (customGetAddress) this._customGetAddress = customGetAddress;
		if (customGetScriptHash) this._customGetScriptHash = customGetScriptHash;
		this.id = generateWalletId(this._seed);
		this.name = name ?? this.id;
		this.addressType = addressType;
		this.transaction = new Transaction({
			wallet: this
		});
		this.feeEstimates = cloneDeep(defaultFeesShape);
		this.disableMessages = disableMessages;
		this.sendMessage = <K extends keyof TMessageDataMap>(
			key: K,
			data: TMessageDataMap[K]
		): void => {
			if (this.disableMessages) return;
			onMessage(key, data);
		};
		this.electrumOptions = electrumOptions;
		this.electrum = new Electrum({
			wallet: this,
			network: this.network,
			...electrumOptions
		});
		this.rbf = rbf;
		this.selectedFeeId = selectedFeeId;
		this.isRefreshing = false;
		this.isSwitchingNetworks = false;
		this.addressTypesToMonitor = addressTypesToMonitor;
		if (!this.addressTypesToMonitor.includes(this.addressType)) {
			this.addressTypesToMonitor.push(this.addressType);
		}
		// Remove duplicates
		this.addressTypesToMonitor = [...new Set(this.addressTypesToMonitor)];
		this.gapLimitOptions = {
			lookBehind: isPositive(gapLimitOptions.lookBehind)
				? gapLimitOptions.lookBehind
				: 1,
			lookAhead: isPositive(gapLimitOptions.lookAhead)
				? gapLimitOptions.lookAhead
				: 1,
			lookBehindChange: isPositive(gapLimitOptions.lookBehindChange)
				? gapLimitOptions.lookBehindChange
				: 1,
			lookAheadChange: isPositive(gapLimitOptions.lookAheadChange)
				? gapLimitOptions.lookAheadChange
				: 1
		};
	}

	public get data(): IWalletData {
		return this._data;
	}

	public get transactions(): IFormattedTransactions {
		return this._data.transactions;
	}

	public get unconfirmedTransactions(): IFormattedTransactions {
		return this._data.unconfirmedTransactions;
	}

	public get utxos(): IUtxo[] {
		return this._data.utxos;
	}

	public get balance(): number {
		return this._data.balance;
	}

	public get network(): EAvailableNetworks {
		return this._network;
	}

	static async create(params: IWallet): Promise<Result<Wallet>> {
		try {
			const wallet = new Wallet(params);
			if (wallet._disableMessagesOnCreate) wallet.disableMessages = true;
			const res = await wallet.setWalletData();
			if (res.isErr()) return err(res.error.message);
			wallet.updateFeeEstimates(true);
			wallet.refreshWallet({});
			if (wallet._disableMessagesOnCreate) wallet.disableMessages = false;
			return ok(wallet);
		} catch (e) {
			return err(e);
		}
	}

	public async switchNetwork(
		network: EAvailableNetworks,
		servers?: TServer | TServer[]
	): Promise<Result<Wallet>> {
		this.isSwitchingNetworks = true;
		// Disconnect from Electrum.
		await this.electrum.disconnect();

		this._network = network;
		this._data = getDefaultWalletData();
		const params: IWallet = {
			...this,
			mnemonic: this._mnemonic,
			passphrase: this._passphrase,
			network,
			electrumOptions: {
				servers,
				tls: this.electrumOptions?.tls,
				net: this.electrumOptions?.net
			},
			storage: {
				getData: this._getData,
				setData: this._setData
			},
			data: getDefaultWalletData(),
			onMessage: this.sendMessage
		};
		const createRes = await Wallet.create(params);
		if (createRes.isErr()) return err(createRes.error.message);
		Object.assign(this, createRes.value);
		await this.updateFeeEstimates(true);
		this.isSwitchingNetworks = false;
		return ok(this);
	}

	/**
	 * Updates the address type for the current wallet.
	 * @param {EAddressType} addressType
	 * @returns {Promise<void>}
	 */
	async updateAddressType(addressType: EAddressType): Promise<void> {
		this.addressType = addressType;
		if (!this.addressTypesToMonitor.includes(this.addressType)) {
			this.addressTypesToMonitor.push(this.addressType);
		}
		await this.saveWalletData('addressType', addressType);
		await this.refreshWallet({});
	}

	/**
	 * Refreshes/Syncs the wallet data.
	 * @param {boolean} [scanAllAddresses]
	 * @param {string[]} [additionalAddresses]
	 * @returns {Promise<Result<IWalletData>>}
	 */
	public async refreshWallet({
		scanAllAddresses = false,
		additionalAddresses = [],
		force = false
	}: {
		scanAllAddresses?: boolean;
		additionalAddresses?: string[];
		force?: boolean;
	} = {}): Promise<Result<IWalletData>> {
		if (this.isRefreshing && !force) {
			return new Promise((resolve) => {
				this._pendingRefreshPromises.push(resolve);
			});
		}
		this.isRefreshing = true;
		this.updateFeeEstimates();
		try {
			await this.setZeroIndexAddresses();
			const r1 = await this.updateAddressIndexes();
			if (r1.isErr()) {
				return this._handleRefreshError(r1.error.message);
			}
			const r2 = await this.getUtxos({
				scanningStrategy: scanAllAddresses ? EScanningStrategy.all : undefined,
				additionalAddresses
			});
			if (r2.isErr()) {
				return this._handleRefreshError(r2.error.message);
			}
			const r3 = await this.updateTransactions({ scanAllAddresses });
			if (r3.isErr()) {
				return this._handleRefreshError(r3.error.message);
			}
			await this.electrum.subscribeToAddresses();
			if (!force) {
				this._resolveAllPendingRefreshPromises(ok(this.data));
			}
			return ok(this.data);
		} catch (e) {
			if (force) {
				return err(e);
			} else {
				return this._handleRefreshError(e);
			}
		}
	}

	private _resolveAllPendingRefreshPromises(result: Result<IWalletData>): void {
		this.isRefreshing = false;
		while (this._pendingRefreshPromises.length > 0) {
			const resolve = this._pendingRefreshPromises.shift();
			if (resolve) {
				resolve(result);
			}
		}
	}

	private _handleRefreshError(errorMessage: string): Result<IWalletData> {
		this.isRefreshing = false;
		this._resolveAllPendingRefreshPromises(err(errorMessage));
		return err(errorMessage);
	}

	/**
	 * Sets the wallet data object.
	 * @returns {Promise<Result<boolean>>}
	 * @private
	 */
	private async setWalletData(): Promise<Result<boolean>> {
		try {
			const storageIdCheckRes = await this.storageIdCheck(this.id);
			if (storageIdCheckRes.isErr())
				return err(storageIdCheckRes.error.message);
			this._data = getDefaultWalletData();
			const walletDataResponse = await this.getWalletData();
			if (walletDataResponse.isErr())
				return err(walletDataResponse.error.message);
			this._data = walletDataResponse.value;
			return ok(true);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Ensure we are not overwriting wallet data of a different wallet by checking that the wallet id's match.
	 * @private
	 * @async
	 * @param {string} id
	 * @returns {Promise<Result<string>>}
	 */
	private async storageIdCheck(id: string): Promise<Result<string>> {
		const storageKey = this.getWalletDataKey('id');
		const res = await this._getData(storageKey);
		// No id found, it is safe to save to storage.
		if (res.isErr() || !res.value) {
			// Save id to storage.
			this._data.id = id;
			await this.saveWalletData('id', id);
			return ok('Saved ID to storage.');
		}
		// If the ID saved in storage does not match return an error and notify the developer.
		if (res.value !== id) {
			const msg =
				'Mismatched id found in storage. Change the wallet name or delete the old wallet from storage and try again.';
			console.log(msg);
			return err(msg);
		}
		return ok("ID's match, it's safe to continue.");
	}

	/**
	 * Returns the key used for storing wallet data in the key/value pair.
	 * @returns {string}
	 * @param key
	 */
	public getWalletDataKey(key: keyof IWalletData): string {
		return getWalletDataStorageKey(this.name, this._network, key);
	}

	/**
	 * Gets the wallet data object from storage if able.
	 * Otherwise, it falls back to the default wallet data object.
	 * @returns {Promise<Result<IWalletData>>}
	 */
	public async getWalletData(): Promise<Result<IWalletData>> {
		try {
			const walletDataKeys = getDefaultWalletDataKeys();
			const walletData: IWalletData = getDefaultWalletData();
			await Promise.all(
				walletDataKeys.map(async (key) => {
					let dataResult;
					try {
						const walletDataKey = this.getWalletDataKey(key);
						const getDataRes = await this._getData(walletDataKey);
						if (getDataRes.isErr()) {
							//dataResult = getDataRes?.value ?? walletData[key];
							return err(dataResult.error.message);
						}
						dataResult = getDataRes?.value;
					} catch (e) {
						console.log(e);
					}
					const data = dataResult ?? walletData[key];
					switch (key) {
						case 'id':
							walletData[key] = data as string;
							break;
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
						case 'header':
							walletData[key] = data as IHeader;
							break;
						case 'boostedTransactions':
							walletData[key] = data as IBoostedTransactions;
							break;
						case 'selectedFeeId':
							walletData[key] = data as EFeeId;
							break;
						case 'feeEstimates':
							walletData[key] = data as IOnchainFees;
							break;
						default:
							console.log(`Unhandled key in getWalletData: ${key}`);
							break;
					}
				})
			);
			return ok(walletData);
		} catch (e) {
			console.log(e);
			return err(e);
		}
	}

	/**
	 * Returns the Network object of the currently selected network (bitcoin or testnet).
	 * @param {TAvailableNetworks} [network]
	 * @returns {Network}
	 */
	private getBitcoinNetwork(network?: TAvailableNetworks): Network {
		if (!network) network = this._network;
		return bitcoin.networks[network];
	}

	/**
	 * Ensures the provided mnemonic matches the one stored in the wallet and is valid.
	 * @param mnemonic
	 * @returns {boolean}
	 */
	isValid(mnemonic): boolean {
		return mnemonic === this._mnemonic && validateMnemonic(mnemonic);
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
	): Promise<Result<IGetAddressResponse>> {
		try {
			if (this._customGetAddress) {
				const data = {
					path,
					type: addressType,
					selectedNetwork: getElectrumNetwork(this._network)
				};
				const res = await this._customGetAddress(data);
				if (res.isErr()) return err(res.error.message);
			}
			const keyPair = this._root.derivePath(path);
			const network = this.getBitcoinNetwork(this._network);
			const addressInfo = getAddressFromKeyPair({
				keyPair,
				addressType,
				network
			});
			if (addressInfo.isErr()) return err(addressInfo.error.message);
			return ok({
				...addressInfo.value,
				path
			});
		} catch (e) {
			return err(e);
		}
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
				network: this._network
			});
			if (pathRes.isErr()) {
				return '';
			}
			const path = pathRes.value;
			const res = await this._getAddress(path, addressType);
			if (res.isErr()) return '';
			return res.value.address;
		} catch {
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
			if (getAddressRes.isErr()) return err('Unable to get address.');
			return ok(getAddressRes.value);
		} catch (e) {
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
			network: this._network,
			servers: servers ?? this.electrumOptions?.servers
		});
		let msg = 'Unable to connect to Electrum server.';
		if (res.isErr()) {
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
			network: this._network
		});
		const res = await this.electrum.getAddressBalance(scriptHash);
		if (res.error) return err('Unable to get address balance at this time.');
		return ok({ unconfirmed: res.unconfirmed, confirmed: res.confirmed });
	}

	/**
	 * Returns combined balance of provided addresses.
	 * @async
	 * @param {string[]} addresses
	 * @returns {Promise<Result<number>>}
	 */
	public async getAddressesBalance(
		addresses: string[] = []
	): Promise<Result<number>> {
		try {
			const network = this._network;
			const scriptHashes = await Promise.all(
				addresses.map(async (address) => {
					return await this.getScriptHash({ address, network });
				})
			);
			const res =
				await this.electrum.getAddressScriptHashBalances(scriptHashes);
			if (res.error || typeof res.data === 'string') {
				return err(JSON.stringify(res.data));
			}
			return ok(
				res.data.reduce((acc, cur) => {
					return (
						acc +
						Number(cur.result?.confirmed ?? 0) +
						Number(cur.result?.unconfirmed ?? 0)
					);
				}, 0) || 0
			);
		} catch (e) {
			return err(e);
		}
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
		if (this._customGetScriptHash) {
			const selectedNetwork = getElectrumNetwork(network);
			return await this._customGetScriptHash({ address, selectedNetwork });
		}
		return getScriptHash({ address, network });
	}

	/**
	 * Returns private key for the provided path.
	 * @param path
	 * @returns {string}
	 */
	getPrivateKey(path: string): string {
		const keyPair = this._root.derivePath(path);
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
		const network = this._network;
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
						network
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
			const network = this._network;
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

			const originalHighestStoredIndexes = this.getHighestStoredAddressIndex({
				addressType
			});
			if (originalHighestStoredIndexes.isErr()) {
				return err(originalHighestStoredIndexes.error.message);
			}
			const originalHighestStoredIndex =
				originalHighestStoredIndexes.value.addressIndex;
			const originalHighestStoredChangeIndex =
				originalHighestStoredIndexes.value.changeAddressIndex;

			const addressIndexDiff = getAddressIndexDiff(
				originalHighestStoredIndex.index,
				lastUsedAddressIndex.index
			);
			const addressesToGenerate =
				this.gapLimitOptions.lookAhead - addressIndexDiff;
			let shouldSaveAddresses = false;
			let shouldSaveChangeAddresses = false;
			if (addressesToGenerate > 0) {
				const generatedAddresses = await this.addAddresses({
					addressAmount: addressesToGenerate,
					addressIndex: 0,
					changeAddressAmount: 0,
					keyDerivationPath,
					addressType,
					saveAddresses: false
				});
				if (generatedAddresses.isErr()) {
					return err(generatedAddresses.error);
				}
				shouldSaveAddresses = true;
				if (addressIndex.index < 0) {
					const addresses = generatedAddresses.value.addresses;
					const sorted = Object.values(addresses).sort(
						(a, b) => a.index - b.index
					);
					if (sorted.length >= 1 && sorted[0].index >= 0)
						addressIndex = sorted[0];
				}
			}

			const changeAddressIndexDiff = getAddressIndexDiff(
				originalHighestStoredChangeIndex.index,
				lastUsedChangeAddressIndex.index
			);
			const changeAddressesToGenerate =
				this.gapLimitOptions.lookAheadChange - changeAddressIndexDiff;

			if (changeAddressesToGenerate > 0) {
				const generatedAddresses = await this.addAddresses({
					addressAmount: 0,
					changeAddressAmount: changeAddressesToGenerate,
					changeAddressIndex: 0,
					keyDerivationPath,
					addressType,
					saveAddresses: false
				});
				if (generatedAddresses.isErr()) {
					return err(generatedAddresses.error);
				}
				shouldSaveChangeAddresses = true;
				if (changeAddressIndex.index < 0) {
					const changeAddresses = generatedAddresses.value.changeAddresses;
					const sorted = Object.values(changeAddresses).sort(
						(a, b) => a.index - b.index
					);
					if (sorted.length >= 1 && sorted[0].index >= 0)
						changeAddressIndex = sorted[0];
				}
			}

			// Save any addresses that have been created thus far if necessary.
			const promises: Promise<string>[] = [];
			if (shouldSaveAddresses) {
				promises.push(this.saveWalletData('addresses', this._data.addresses));
			}
			if (shouldSaveChangeAddresses) {
				promises.push(
					this.saveWalletData('changeAddresses', this._data.changeAddresses)
				);
			}
			await Promise.all(promises);

			let addresses = filterAddressesObjForGapLimit({
				addresses: this._data.addresses[addressType],
				index: addressIndex.index,
				gapLimitOptions: this.gapLimitOptions,
				change: false
			});
			let changeAddresses = filterAddressesObjForGapLimit({
				addresses: this._data.changeAddresses[addressType],
				index: changeAddressIndex.index,
				gapLimitOptions: this.gapLimitOptions,
				change: true
			});

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
					addressIndex: lastUsedAddressIndex,
					changeAddressIndex: lastUsedChangeAddressIndex
				});

				if (highestUsedIndex.isErr()) {
					console.log(highestUsedIndex.error.message);
					return lastKnownIndexes;
				}

				if (highestUsedIndex.value.foundAddressIndex) {
					lastUsedAddressIndex = highestUsedIndex.value.addressIndex;
					addressIndex = highestUsedIndex.value.addressIndex;
					addressHasBeenUsed = true;
				}
				if (highestUsedIndex.value.foundChangeAddressIndex) {
					lastUsedChangeAddressIndex =
						highestUsedIndex.value.changeAddressIndex;
					changeAddressIndex = highestUsedIndex.value.changeAddressIndex;
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

				if (
					getAddressIndexDiff(
						highestUsedAddressIndex.index,
						highestStoredAddressIndex.index
					) >= this.gapLimitOptions.lookAhead
				) {
					foundLastUsedAddress = true;
				}

				if (
					getAddressIndexDiff(
						highestUsedChangeAddressIndex.index,
						highestStoredChangeAddressIndex.index
					) >= this.gapLimitOptions.lookAheadChange
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
					await Promise.all([
						this.saveWalletData('addresses', this._data.addresses),
						this.saveWalletData('changeAddresses', this._data.changeAddresses)
					]);
					return ok({
						addressIndex: nextAvailableAddress,
						lastUsedAddressIndex,
						changeAddressIndex: nextAvailableChangeAddress,
						lastUsedChangeAddressIndex
					});
				}

				//Create receiving addresses for the next round
				if (!foundLastUsedAddress) {
					const addressAmount =
						this.gapLimitOptions.lookAhead -
						getAddressIndexDiff(
							highestUsedAddressIndex.index,
							highestStoredAddressIndex.index
						);
					const newAddresses = await this.addAddresses({
						addressAmount,
						changeAddressAmount: 0,
						addressIndex: highestStoredIndex.value.addressIndex.index + 1,
						changeAddressIndex: 0,
						keyDerivationPath,
						addressType,
						saveAddresses: false
					});
					if (newAddresses.isOk()) {
						addresses = newAddresses.value.addresses || {};
					}
				}
				//Create change addresses for the next round
				if (!foundLastUsedChangeAddress) {
					const changeAddressAmount =
						this.gapLimitOptions.lookAheadChange -
						getAddressIndexDiff(
							highestUsedChangeAddressIndex.index,
							highestStoredChangeAddressIndex.index
						);
					const newChangeAddresses = await this.addAddresses({
						addressAmount: 0,
						changeAddressAmount,
						addressIndex: 0,
						changeAddressIndex:
							highestStoredIndex.value.changeAddressIndex.index + 1,
						keyDerivationPath,
						addressType,
						saveAddresses: false
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
				// Check UTXO's as we generate addresses.
				await this.getUtxos({
					addressIndex: addressIndex.index,
					changeAddressIndex: changeAddressIndex.index,
					addressTypesToCheck: [addressType]
				});
			}

			await Promise.all([
				this.saveWalletData('addresses', this._data.addresses),
				this.saveWalletData('changeAddresses', this._data.changeAddresses)
			]);

			return lastKnownIndexes;
		} catch (e) {
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
	 * @param {boolean} [saveAddresses] If true (default), will save new addresses to storage. When batching address-saves false is used.
	 * @returns {Promise<Result<IGenerateAddressesResponse>>}
	 */
	private async addAddresses({
		addressAmount = 5,
		changeAddressAmount = 5,
		addressIndex = 0,
		changeAddressIndex = 0,
		addressType = this.addressType,
		keyDerivationPath,
		saveAddresses = true
	}: IGenerateAddresses): Promise<Result<IGenerateAddressesResponse>> {
		const network = this._network;
		const { path, type } = addressTypes[addressType];
		if (!keyDerivationPath) {
			const keyDerivationPathResponse = getKeyDerivationPathObject({
				path,
				network
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
			this._data.addresses[addressType] = {
				...this.data.addresses[addressType],
				...addresses
			};
			if (saveAddresses)
				await this.saveWalletData('addresses', this._data.addresses);
		}
		if (Object.keys(changeAddresses).length) {
			this._data.changeAddresses[addressType] = {
				...this.data.changeAddresses[addressType],
				...changeAddresses
			};
			if (saveAddresses)
				await this.saveWalletData(
					'changeAddresses',
					this._data.changeAddresses
				);
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
			return err(e);
		}
	}

	/**
	 * This method updates the next available (zero-balance) address & changeAddress index.
	 * @private
	 * @async
	 * @returns {Promise<Result<string>>}
	 */
	private async updateAddressIndexes(): Promise<Result<string>> {
		const checkRes = await this.checkElectrumConnection();
		if (checkRes.isErr()) return err(checkRes.error.message);
		const currentWallet = this.data;

		let updated = false;

		const promises = this.addressTypesToMonitor.map(async (addressTypeKey) => {
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
				if (currentGap > this.gapLimitOptions.lookBehind) {
					const excessAmount = currentGap - this.gapLimitOptions.lookBehind;
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
				if (currentChangeAddressGap > this.gapLimitOptions.lookBehindChange) {
					const excessAmount =
						currentGap - this.gapLimitOptions.lookBehindChange;
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

				this._data.addressIndex[addressTypeKey] = addressIndex;
				this._data.changeAddressIndex[addressTypeKey] = changeAddressIndex;
				this._data.lastUsedAddressIndex[addressTypeKey] = lastUsedAddressIndex;
				this._data.lastUsedChangeAddressIndex[addressTypeKey] =
					lastUsedChangeAddressIndex;
				updated = true;
			}
		});
		try {
			await Promise.all(promises);
			if (updated) {
				await Promise.all([
					this.saveWalletData('addressIndex', this._data.addressIndex),
					this.saveWalletData(
						'changeAddressIndex',
						this._data.changeAddressIndex
					),
					this.saveWalletData(
						'lastUsedAddressIndex',
						this._data.lastUsedAddressIndex
					),
					this.saveWalletData(
						'lastUsedChangeAddressIndex',
						this._data.lastUsedChangeAddressIndex
					)
				]);
			}
			return ok(
				updated ? 'Successfully updated indexes.' : 'No update needed.'
			);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Resets address indexes back to the app's default/original state.
	 * @private
	 * @returns {void}
	 */
	public async resetAddressIndexes(): Promise<void> {
		const defaultWalletShape = getDefaultWalletData();
		this._data.addressIndex = defaultWalletShape.addressIndex;
		this._data.changeAddressIndex = defaultWalletShape.changeAddressIndex;
		this._data.lastUsedAddressIndex = defaultWalletShape.lastUsedAddressIndex;
		this._data.lastUsedChangeAddressIndex =
			defaultWalletShape.lastUsedChangeAddressIndex;
		await Promise.all([
			this.saveWalletData('addressIndex', this._data.addressIndex),
			this.saveWalletData('changeAddressIndex', this._data.changeAddressIndex),
			this.saveWalletData(
				'lastUsedAddressIndex',
				this._data.lastUsedAddressIndex
			),
			this.saveWalletData(
				'lastUsedChangeAddressIndex',
				this._data.lastUsedChangeAddressIndex
			)
		]);
	}

	/**
	 * Generate a new receive address for the provided addresstype up to the set gap limit.
	 * @async
	 * @param {EAddressType} addressType
	 * @param {boolean} [overrideGapLimit] WARNING: Only set to true if you understand what you're doing. This can result in other wallets not seeing your funds as this will override the previously set/standard gap limit.
	 * @param {IKeyDerivationPath} keyDerivationPath
	 * @returns {Promise<Result<IAddress>>}
	 */
	public async generateNewReceiveAddress({
		addressType = this.addressType,
		overrideGapLimit = false, // WARNING: Only set to true if you understand what you're doing. This can result in other wallets not seeing your funds as this will override the previously set/standard gap limit.
		keyDerivationPath
	}: {
		addressType?: EAddressType;
		overrideGapLimit?: boolean; // WARNING: Only set to true if you understand what you're doing. This can result in other wallets not seeing your funds as this will override the previously set/standard gap limit.
		keyDerivationPath?: IKeyDerivationPath;
	} = {}): Promise<Result<IAddress>> {
		try {
			const network = this._network;
			const currentWallet = this.data;

			const getGapLimitResponse = this.getGapLimit({
				addressType
			});
			if (getGapLimitResponse.isErr()) {
				return err(getGapLimitResponse.error.message);
			}
			const { addressDelta } = getGapLimitResponse.value;

			// If the address delta exceeds the default gap limit, only return the current address index.
			if (
				addressDelta >= this.gapLimitOptions.lookBehind &&
				!overrideGapLimit
			) {
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
				this._data.addressIndex[addressType] = nextAddressIndex;
				await this.saveWalletData('addressIndex', this._data.addressIndex);
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
			const addressIndex = Object.values(this.data.addresses[addressType]).find(
				(addr) => addr.index === currentAddressIndex + 1
			);

			// If for any reason we're unable to generate the new address, return error.
			if (!addressIndex) {
				return err('Unable to generate addresses at this time.');
			}
			if (overrideGapLimit) {
				this.updateGapLimit({
					lookBehind:
						addressDelta > this.gapLimitOptions.lookBehind
							? addressDelta
							: this.gapLimitOptions.lookBehind,
					lookAhead:
						addressDelta > this.gapLimitOptions.lookAhead
							? addressDelta
							: this.gapLimitOptions.lookAhead,
					lookBehindChange:
						addressDelta > this.gapLimitOptions.lookBehindChange
							? addressDelta
							: this.gapLimitOptions.lookBehindChange,
					lookAheadChange:
						addressDelta > this.gapLimitOptions.lookAheadChange
							? addressDelta
							: this.gapLimitOptions.lookAheadChange
				});
			}
			this._data.addressIndex[addressType] = addressIndex;
			await this.saveWalletData('addressIndex', this._data.addressIndex);
			return ok(addressIndex);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Returns the difference between the current address index and the last used address index.
	 * @private
	 * @param {EAddressType} [addressType]
	 * @returns {Result<{ addressDelta: number; changeAddressDelta: number }>}
	 */
	public getGapLimit({
		addressType = this.addressType
	}: {
		addressType?: EAddressType;
	}): Result<{ addressDelta: number; changeAddressDelta: number }> {
		try {
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
			return err(e);
		}
	}

	/**
	 * Retrieves and sets UTXO's for the current wallet from Electrum.
	 * @param {EScanningStrategy} [scanningStrategy]
	 * @param {number} addressIndex
	 * @param {number} changeAddressIndex
	 * @param {EAddressType[]} [addressTypesToCheck]
	 * @returns {Promise<Result<IGetUtxosResponse>>}
	 */
	public async getUtxos({
		scanningStrategy = EScanningStrategy.gapLimit,
		addressIndex,
		changeAddressIndex,
		addressTypesToCheck,
		additionalAddresses = []
	}: {
		scanningStrategy?: EScanningStrategy;
		addressIndex?: number;
		changeAddressIndex?: number;
		addressTypesToCheck?: EAddressType[];
		additionalAddresses?: string[];
	}): Promise<Result<IGetUtxosResponse>> {
		const checkRes = await this.checkElectrumConnection();
		if (checkRes.isErr()) return err(checkRes.error.message);
		const getUtxosRes = await this.electrum.getUtxos({
			scanningStrategy,
			addressIndex,
			changeAddressIndex,
			addressTypesToCheck,
			additionalAddresses
		});
		if (getUtxosRes.isErr()) {
			return err(getUtxosRes.error.message);
		}
		const utxos = removeDustUtxos(getUtxosRes.value?.utxos ?? []);
		const balance = getUtxosRes.value?.balance ?? 0;
		this._data.utxos = utxos;
		this._data.balance = balance;
		await Promise.all([
			this.saveWalletData('utxos', this._data.utxos),
			this.saveWalletData('balance', this._data.balance)
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
	private savingOperations: Record<string, Promise<string>> = {};
	public async saveWalletData<K extends keyof IWalletData>(
		key: TWalletDataKeys,
		data: IWalletData[K]
	): Promise<string> {
		if (!this._setData) return 'No setData method has been provided';

		// Check if there's an ongoing save operation for the same key
		if (key in this.savingOperations) {
			// Wait for the ongoing operation to complete
			await this.savingOperations[key];
		}

		const walletDataKey = this.getWalletDataKey(key);
		// Create a new save operation
		this.savingOperations[key] = this._setData(walletDataKey, data)
			.then(() => {
				return `${walletDataKey} data saved successfully`;
			})
			.catch((error) => {
				return `Error saving wallet data for ${walletDataKey}: ${error}`;
			})
			.finally(() => {
				// Remove the operation once it's completed
				delete this.savingOperations[key];
			});

		// Wait for the save operation to complete
		return await this.savingOperations[key];
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
			await this.saveWalletData(key, this._data[key]);
		} else {
			// @ts-ignore
			this.data[key] = data;
			await this.saveWalletData(key, this._data[key]);
		}
	}

	/**
	 * Retrieves, formats & stores the transaction history for the selected wallet/network.
	 * @param {boolean} [scanAllAddresses]
	 * @param {boolean} [replaceStoredTransactions] Setting this to true will set scanAllAddresses to true as well.
	 * @returns {Promise<Result<string | undefined>>}
	 */
	public async updateTransactions({
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

		// Filter out transactions that are already confirmed.
		let filteredTxHashes = history.value;
		if (!replaceStoredTransactions) {
			filteredTxHashes = history.value.filter((tx) => {
				return !((this.data.transactions[tx.tx_hash]?.height ?? 0) >= 6);
			});
		}

		const getTransactionsResponse = await this.electrum.getTransactions({
			txHashes: filteredTxHashes
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
			// No need to check the existing txs since we're replacing them. Update with the returned formatTransactionsResponse.
			this._data.transactions = transactions;
			await this.saveWalletData('transactions', this._data.transactions);
			return ok(undefined);
		}

		// Handle new or updated transactions.
		const formattedTransactions: IFormattedTransactions = {};

		let notificationTxid: string | undefined;
		const storedTransactions = this.data.transactions;
		const confirmedTxs: TTransactionMessage[] = [];
		const receivedTxs: TTransactionMessage[] = [];
		const sentTxs: TTransactionMessage[] = [];

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
				if ((formattedTransactions[txid]?.height ?? 0) > 0)
					confirmedTxs.push({ transaction: formattedTransactions[txid] });
			}

			// if the tx is new, incoming but not from a transfer - show notification
			if (!(txid in storedTransactions)) {
				if (transactions[txid].type === EPaymentType.received) {
					receivedTxs.push({ transaction: transactions[txid] });
				} else if (transactions[txid].type === EPaymentType.sent) {
					sentTxs.push({ transaction: transactions[txid] });
				}
				notificationTxid = txid;
			}
		});

		//No new or updated transactions
		if (!Object.keys(formattedTransactions).length) {
			return ok(undefined);
		}

		this._data.transactions = {
			...this._data.transactions,
			...formattedTransactions
		};
		await this.saveWalletData('transactions', this._data.transactions);

		confirmedTxs.forEach((tx) => {
			this.sendMessage('transactionConfirmed', tx);
		});

		sentTxs.forEach((tx) => {
			this.sendMessage('transactionSent', tx);
		});

		const addresses = this.data.addresses;
		const utxoScriptHashes = new Set(
			this.data.utxos.map((utxo) => utxo.scriptHash)
		);
		const outsideGapLimitAddresses: {
			[key: string]: number[];
		} = {};
		for (const tx of receivedTxs) {
			this.sendMessage('transactionReceived', tx);
			// No need to scan an address with a saved UTXO.
			if (utxoScriptHashes.has(tx.transaction.scriptHash)) continue;
			for (const addressType in addresses) {
				const addressData: IAddresses = addresses[addressType];
				if (tx.transaction.scriptHash in addressData) {
					const address = addressData[tx.transaction.scriptHash];
					const index = address.index;
					const currentIndex = this.data.addressIndex[addressType].index;
					const diff = getAddressIndexDiff(index, currentIndex);
					if (diff > this.gapLimitOptions.lookBehind) {
						outsideGapLimitAddresses[addressType] = [
							...(outsideGapLimitAddresses[addressType] ?? []),
							index
						];
					}
					break;
				}
			}
		}
		if (receivedTxs.length > 0) {
			// Scan for received transactions to addresses out of the specified gap limit that we may still be subscribed to from the current session.
			for (const type of Object.keys(outsideGapLimitAddresses)) {
				const indexes = outsideGapLimitAddresses[type];
				if (indexes.length <= 0) continue;
				const lowestIndex = Math.min(...indexes);
				const addressType = type as EAddressType;
				await this.getUtxos({
					scanningStrategy: EScanningStrategy.startingIndex,
					addressIndex: lowestIndex - this.gapLimitOptions.lookBehind,
					changeAddressIndex:
						lowestIndex - this.gapLimitOptions.lookBehindChange,
					addressTypesToCheck: [addressType]
				});
			}
		}

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
	async checkUnconfirmedTransactions(
		reorgDetected = false
	): Promise<Result<string>> {
		try {
			const processRes = await this.processUnconfirmedTransactions();
			if (processRes.isErr()) {
				return err(processRes.error.message);
			}

			const { unconfirmedTxs, outdatedTxs, ghostTxs } = processRes.value;
			if (outdatedTxs.length > 0 || reorgDetected) {
				this.sendMessage('reorg', outdatedTxs);
				//We need to update the height of the transactions that were reorg'd out.
				await this.updateTransactionHeights(outdatedTxs);
			}
			if (ghostTxs.length > 0) {
				this.sendMessage('rbf', ghostTxs);
				//We need to update the ghost transactions in the store & activity-list and rescan the addresses to get the correct balance.
				await this.updateGhostTransactions({
					txIds: ghostTxs
				});
			} else {
				this._data.unconfirmedTransactions = unconfirmedTxs;
				await this.saveWalletData(
					'unconfirmedTransactions',
					this._data.unconfirmedTransactions
				);
			}
			return ok('Successfully updated unconfirmed transactions.');
		} catch (e) {
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
	 * @returns {Promise<Result<TProcessUnconfirmedTransactions>>}
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
	 * Updates & Saves header information to storage.
	 * @param headerData
	 * @returns {Promise<void>}
	 */
	public async updateHeader(headerData: IHeader): Promise<void> {
		this._data.header = headerData;
		await this.saveWalletData('header', headerData);
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
			this._data.transactions = transactions;
			await this.saveWalletData('transactions', transactions);
			this._data.unconfirmedTransactions = unconfirmedTransactions;
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
			return err(e);
		}
	}

	/**
	 * This method will clear the utxo array for each address type and reset the
	 * address indexes back to the original/default app values. Once cleared & reset
	 * the app will rescan the wallet's addresses from index zero at the standard gap
	 * limit or higher (if previously set higher by the user).
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
		// If the gap limit settings are less than the standard, ensure we set the standard gap limit before rescanning.
		const currentGapLimitOptions = this.gapLimitOptions;
		if (
			currentGapLimitOptions.lookBehind < GAP_LIMIT ||
			currentGapLimitOptions.lookAhead < GAP_LIMIT ||
			currentGapLimitOptions.lookBehindChange < GAP_LIMIT_CHANGE ||
			currentGapLimitOptions.lookAheadChange < GAP_LIMIT_CHANGE
		) {
			this.updateGapLimit({
				lookBehind:
					currentGapLimitOptions.lookBehind < GAP_LIMIT
						? GAP_LIMIT
						: currentGapLimitOptions.lookBehind,
				lookAhead:
					currentGapLimitOptions.lookAhead < GAP_LIMIT
						? GAP_LIMIT
						: currentGapLimitOptions.lookAhead,
				lookBehindChange:
					currentGapLimitOptions.lookBehindChange < GAP_LIMIT_CHANGE
						? GAP_LIMIT_CHANGE
						: currentGapLimitOptions.lookBehindChange,
				lookAheadChange:
					currentGapLimitOptions.lookAheadChange < GAP_LIMIT_CHANGE
						? GAP_LIMIT_CHANGE
						: currentGapLimitOptions.lookAheadChange
			});
		}
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
		const refreshWalletRes = await this.refreshWallet({
			scanAllAddresses: true,
			force: true
		});
		// Revert gap limit options to the original settings.
		this.updateGapLimit(currentGapLimitOptions);
		return refreshWalletRes;
	}

	/**
	 * Clears the UTXO array and balance from storage.
	 * @public
	 * @async
	 * @returns {Promise<string>}
	 */
	public async clearUtxos(): Promise<string> {
		this._data.balance = 0;
		this._data.utxos = [];
		await Promise.all([
			this.saveWalletData('balance', this._data.balance),
			this.saveWalletData('utxos', this._data.utxos)
		]);
		return "Successfully cleared UTXO's.";
	}

	/**
	 * Clears the transactions object for a given wallet and network from storage.
	 * @private
	 * @returns {string}
	 */
	private async clearTransactions(): Promise<string> {
		this._data.transactions = getDefaultWalletData().transactions;
		await this.saveWalletData('transactions', this._data.transactions);
		return 'Successfully reset transactions.';
	}

	/**
	 * Clears the addresses and changeAddresses object for a given wallet and network.
	 * @private
	 * @async
	 * @returns {Promise<string>}
	 */
	private async clearAddresses(): Promise<string> {
		this._data.addresses = getAddressTypeContent<IAddresses>({});
		this._data.changeAddresses = getAddressTypeContent<IAddresses>({});
		await Promise.all([
			this.saveWalletData('addresses', this._data.addresses),
			this.saveWalletData('changeAddresses', this._data.changeAddresses)
		]);
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
		const transactions = this.data.transactions;
		txs.forEach((tx) => {
			const txId = tx.tx_hash;
			if (txId in transactions) {
				transactions[txId].confirmTimestamp = 0;
				needsSave = true;
			}
		});
		if (needsSave) {
			await this.saveWalletData('transactions', transactions);
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
					blockHeight: transactions[key]?.height ?? 0
				});
				if (confirmations < 6) {
					unconfirmedTransactions[key] = transactions[key];
				}
			});

			if (!Object.keys(unconfirmedTransactions).length) {
				return ok('No unconfirmed transactions found.');
			}

			this._data.unconfirmedTransactions = {
				...this.data.unconfirmedTransactions,
				...unconfirmedTransactions
			};

			await this.saveWalletData(
				'unconfirmedTransactions',
				this._data.unconfirmedTransactions
			);
			return ok('Successfully updated unconfirmed transactions.');
		} catch (e) {
			console.log(e);
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
		if (!blockHeight || blockHeight <= 0) {
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
			return err(
				inputDataResponse.error?.message ?? 'Unable to get input data.'
			);
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

				const key = `${txid}${vout}`;
				if (key in inputData) {
					const { addresses: _addresses, value } = inputData[key];
					totalInputValue = totalInputValue + value;
					_addresses.map((address) => {
						if (address in combinedAddressObj) {
							matchedInputValue = matchedInputValue + value;
						}
					});
				}
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
			const vsize = result.vsize;
			const satsPerByte = Math.round(btcToSats(fee) / vsize);
			const { address, height, scriptHash } = data;
			let timestamp = Date.now();
			let confirmTimestamp: number | undefined;
			const blockhash = result.blockhash;

			if (height > 0 && result.blocktime) {
				confirmTimestamp = result.blocktime * 1000;
				//In the event we're recovering, set the older timestamp.
				if (confirmTimestamp < timestamp) {
					timestamp = confirmTimestamp;
				}
			}

			formattedTransactions[txid] = {
				address,
				blockhash,
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
				rbf,
				exists: true,
				vsize
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
			const failedRequests: { tx_hash: string; vout: number }[] = [];

			const batchLimit = this.electrum.batchLimit;
			for (let i = 0; i < inputs.length; i += batchLimit) {
				const chunk = inputs.slice(i, i + batchLimit);

				const getTransactionsResponse =
					await this.electrum.getTransactionsFromInputs({
						txHashes: chunk
					});
				if (getTransactionsResponse.isErr()) {
					return err(
						getTransactionsResponse.error?.message ??
							// @ts-ignore
							getTransactionsResponse.error?.data
					);
				}
				getTransactionsResponse.value.data.map(({ data, result, error }) => {
					if (result && result?.vout) {
						const { addresses, value, key } = this._extractVoutData(
							result.vout[data.vout],
							data
						);
						inputData[key] = { addresses, value };
					} else if (error) {
						if (
							error?.message &&
							error.message.includes('response too large')
						) {
							// No point in re-running this tx_hash since Electrum considers the tx too large, just log the error.
							this._logGetInputDataError(error, data);
						} else {
							failedRequests.push(data);
						}
					}
				});
			}

			// Attempt to retrieve the data for any failed getTransactionsFromInputs request.
			for (const input of failedRequests) {
				const getTransactionsResponse =
					await this.electrum.getTransactionsFromInputs({
						txHashes: [input]
					});
				if (getTransactionsResponse.isErr()) {
					return err(
						getTransactionsResponse.error?.message ??
							// @ts-ignore
							getTransactionsResponse.error?.data
					);
				}
				getTransactionsResponse.value.data.map(({ data, result, error }) => {
					if (result && result?.vout) {
						const { addresses, value, key } = this._extractVoutData(
							result.vout[data.vout],
							data
						);
						inputData[key] = { addresses, value };
					} else if (error) {
						this._logGetInputDataError(error, data);
					}
				});
			}
			return ok(inputData);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Extracts data from the provided vout.
	 * @private
	 * @param {IVout} vout
	 * @param { tx_hash: string; vout: number } data
	 * @returns { addresses: string[]; value: number; key: string }
	 */
	private _extractVoutData(
		vout: IVout,
		data: { tx_hash: string; vout: number }
	): { addresses: string[]; value: number; key: string } {
		const addresses = vout.scriptPubKey.addresses
			? vout.scriptPubKey.addresses
			: vout.scriptPubKey.address
			? [vout.scriptPubKey.address]
			: [];
		const value = vout.value;
		const key = `${data.tx_hash}${vout.n}`;
		return { addresses, value, key };
	}

	/*
	 * Logs an error message when getInputData fails to retrieve getTransactionsFromInputs data.
	 * @private
	 * @param { code?: number; message?: string } error
	 * @param { tx_hash: string; vout: number } data
	 * @returns {void}
	 */
	private _logGetInputDataError(
		error: { code?: number; message?: string },
		data: { tx_hash: string; vout: number }
	): void {
		console.error('\nError:', error);
		if (data) {
			console.warn('Unable to retrieve input data for:', data);
		}
		if (error?.code && error.code === -32600)
			console.info(
				'Suggestion: Please increase the response limit on your Electrum server.'
			);
	}

	/**
	 * Attempts to validate a given address.
	 * @param {string} address
	 * @returns {boolean}
	 */
	public validateAddress(address: string): boolean {
		return validateAddress({ address, network: this._network }).isValid;
	}

	/**
	 * Retrieves the next available change address data.
	 * @async
	 * @param {EAddressType} [addressType]
	 * @returns {Promise<Result<IAddress>>}
	 */
	public async getChangeAddress(
		addressType = this.addressType
	): Promise<Result<IAddress>> {
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
	 * @returns {Promise<IOnchainFees>}
	 */
	public async getFeeEstimates(network = this._network): Promise<IOnchainFees> {
		try {
			if (network === EAvailableNetworks.bitcoinRegtest) {
				return { ...defaultFeesShape, timestamp: Date.now() };
			}
			const urlModifier = network === 'bitcoin' ? '' : 'testnet/';
			const response = await fetch(
				`https://mempool.space/${urlModifier}api/v1/fees/recommended`
			);
			const res: IGetFeeEstimatesResponse = await response.json();
			// check the response for the expected properties
			if (
				!(
					res.fastestFee > 0 &&
					res.halfHourFee > 0 &&
					res.hourFee > 0 &&
					res.minimumFee > 0
				)
			) {
				throw new Error('Unexpected response from mempool.space');
			}

			return {
				fast: res.fastestFee,
				normal: res.halfHourFee,
				slow: res.hourFee,
				minimum: res.minimumFee,
				timestamp: Date.now()
			};
		} catch {
			// Falls back to using blocktank for fee estimates if mempool.space is down.
			return this.getFallbackFeeEstimates(network);
		}
	}

	/**
	 * Fallback method to use blocktank for fee estimates if mempool.space is down.
	 * @param {EAvailableNetworks} network
	 * @returns {Promise<IOnchainFees>}
	 */
	public async getFallbackFeeEstimates(
		network = this._network
	): Promise<IOnchainFees> {
		try {
			if (network !== EAvailableNetworks.bitcoinMainnet) {
				return defaultFeesShape;
			}
			const url = 'https://api1.blocktank.to/api/info';
			const response = await fetch(url);
			const res: IBtInfo = await response.json();
			// check the response for the expected properties
			if (
				!(
					res?.onchain?.feeRates?.fast > 0 &&
					res?.onchain?.feeRates?.mid > 0 &&
					res?.onchain?.feeRates?.slow > 0
				)
			) {
				throw new Error('Unexpected response from blocktank');
			}
			const { fast, mid, slow } = res.onchain.feeRates;
			return {
				fast,
				normal: mid,
				slow,
				minimum: slow,
				timestamp: Date.now()
			};
		} catch (e) {
			console.log('Unable to fetch fee estimates.', e);
			return this.feeEstimates;
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
	): Promise<TSetupTransactionResponse> {
		return await this.transaction.setupTransaction(params);
	}

	/**
	 * Returns a fee object for the current transaction.
	 * @param {number} [satsPerByte]
	 * @param {string} [message]
	 * @param {Partial<ISendTransaction>} [transaction]
	 * @param {boolean} [fundingLightning]
	 * @returns {Result<TGetTotalFeeObj>}
	 */
	public getFeeInfo({
		satsPerByte = this.feeEstimates.normal,
		message = '',
		transaction,
		fundingLightning = false
	}: {
		satsPerByte?: number;
		message?: string;
		transaction?: Partial<ISendTransaction>;
		fundingLightning?: boolean;
	} = {}): Result<TGetTotalFeeObj> {
		return this.transaction.getTotalFeeObj({
			satsPerByte,
			message,
			transaction,
			fundingLightning
		});
	}

	/**
	 * Sets up and creates a transaction to multiple outputs.
	 * @param {ISendTx[]} txs
	 * @param {number} [satsPerByte]
	 * @param {boolean} [rbf]
	 * @param {false} [broadcast]
	 * @param {boolean} [shuffleOutputs]
	 * @returns {Promise<Result<string>>}
	 */
	public async sendMany({
		txs = [],
		satsPerByte = this.feeEstimates.normal,
		rbf,
		broadcast = true,
		shuffleOutputs = true
	}: {
		txs: ISendTx[];
		satsPerByte?: number;
		rbf?: boolean;
		broadcast?: boolean;
		shuffleOutputs?: boolean;
	}): Promise<Result<string>> {
		if (!this.data.utxos.length) {
			return err('No UTXOs available.');
		}
		const setupTransactionRes = await this.transaction.setupTransaction({
			rbf
		});
		if (setupTransactionRes.isErr()) {
			return err(setupTransactionRes.error.message);
		}

		if (!Array.isArray(txs)) txs = [txs];

		const shuffledTxs = shuffleOutputs ? shuffleArray(txs) : txs;
		let index = 0;
		for (const tx of shuffledTxs) {
			const updateSendTransactionRes = this.transaction.updateSendTransaction({
				transaction: {
					label: tx.message,
					outputs: [{ address: tx.address, value: tx.amount, index }]
				}
			});
			if (updateSendTransactionRes.isErr())
				err(updateSendTransactionRes.error.message);
			index++;
		}

		const updateFeeRes = this.transaction.updateFee({ satsPerByte });
		if (updateFeeRes.isErr()) {
			if (updateFeeRes.error.message.includes('Unable to increase the fee')) {
				const feeInfo = this.getFeeInfo({ satsPerByte: 1 });
				if (feeInfo.isOk()) {
					return err(
						`Fee is too high. The maximum fee for this transaction is ${feeInfo.value.maxSatPerByte}`
					);
				}
			} else {
				return err(updateFeeRes.error.message);
			}
		}

		const createRes = await this.transaction.createTransaction({
			shuffleOutputs
		});
		if (createRes.isErr()) return err(createRes.error.message);
		const { hex } = createRes.value;
		if (!broadcast) {
			return ok(hex);
		}
		const broadcastRes = await this.electrum.broadcastTransaction({
			rawTx: hex
		});
		if (broadcastRes.isErr()) return err(broadcastRes.error.message);
		return ok(broadcastRes.value);
	}

	/**
	 * Sends the maximum amount of sats to a given address at the specified satsPerByte.
	 * @param {string} address
	 * @param {number} satsPerByte
	 * @param [rbf]
	 * @param {boolean} [broadcast]
	 * @returns {Promise<Result<string>>}
	 */
	public async sendMax({
		address,
		satsPerByte,
		rbf = false,
		broadcast = true
	}: {
		address?: string;
		satsPerByte?: number;
		rbf?: boolean;
		broadcast?: boolean;
	} = {}): Promise<Result<string>> {
		if (!this.data.utxos.length) {
			return err('No UTXOs available.');
		}
		await this.resetSendTransaction();
		const setupTransactionRes = await this.transaction.setupTransaction();
		if (setupTransactionRes.isErr()) {
			return err(setupTransactionRes.error.message);
		}
		const sendMaxRes = await this.transaction.sendMax({
			address,
			satsPerByte,
			rbf
		});

		if (sendMaxRes.isErr()) {
			return err(sendMaxRes.error.message);
		}

		const createRes = await this.transaction.createTransaction({
			shuffleOutputs: true
		});
		if (createRes.isErr()) return err(createRes.error.message);
		const { hex } = createRes.value;
		if (!broadcast) {
			return ok(hex);
		}
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
	 * @param {string} [message]
	 * @param {number} [satsPerByte]
	 * @param {boolean} [rbf]
	 * @param {boolean} [broadcast]
	 * @param {boolean} [shuffleOutputs]
	 * @returns {Promise<Result<string>>}
	 */
	public async send({
		address,
		amount,
		message = '',
		satsPerByte = this.feeEstimates.normal,
		rbf,
		broadcast = true,
		shuffleOutputs = true
	}: {
		address: string;
		amount: number; // sats
		message?: string;
		satsPerByte?: number;
		rbf?: boolean;
		broadcast?: boolean;
		shuffleOutputs?: boolean;
	}): Promise<Result<string>> {
		return await this.sendMany({
			txs: [{ address, amount, message }],
			satsPerByte,
			rbf,
			broadcast,
			shuffleOutputs
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
		const currentWallet = this.data;
		let saveAddressIndexes = false;
		let saveChangeAddressIndexes = false;

		await Promise.all(
			this.addressTypesToMonitor.map(async (addressType) => {
				const addressIndex = currentWallet.addressIndex[addressType];
				const changeAddressIndex =
					currentWallet.changeAddressIndex[addressType];

				if (addressIndex?.index < 0) {
					await this.updateAddressIndex(addressType, false);
					saveAddressIndexes = true;
				}
				if (changeAddressIndex?.index < 0) {
					await this.updateAddressIndex(addressType, true);
					saveChangeAddressIndexes = true;
				}
			})
		);

		if (saveAddressIndexes) {
			await Promise.all([
				this.saveWalletData('addressIndex', this._data.addressIndex),
				this.saveWalletData('addresses', this._data.addresses)
			]);
		}
		if (saveChangeAddressIndexes) {
			await Promise.all([
				this.saveWalletData(
					'changeAddressIndex',
					this._data.changeAddressIndex
				),
				this.saveWalletData('changeAddresses', this._data.changeAddresses)
			]);
		}

		return ok('Set Zero Index Addresses.');
	}

	/**
	 * Updates the address index for a given address type.
	 * @private
	 * @async
	 * @param {EAddressType} addressType
	 * @param {boolean} isChangeAddress
	 * @param {number} [index]
	 * @returns {Promise<void>}
	 */
	private async updateAddressIndex(
		addressType: EAddressType,
		isChangeAddress: boolean,
		index = 0
	): Promise<void> {
		const address = await this.generateAddresses({
			addressAmount: isChangeAddress ? 0 : 1,
			addressIndex: index,
			changeAddressAmount: isChangeAddress ? 1 : 0,
			changeAddressIndex: index,
			addressType
		});
		const indexToUpdate = isChangeAddress
			? 'changeAddressIndex'
			: 'addressIndex';
		if (address.isOk()) {
			const key = isChangeAddress ? 'changeAddresses' : 'addresses';
			this._data[indexToUpdate][addressType] =
				address.value[key][Object.keys(address.value[key])[0]];
		}
		// Ensure we have addresses to pull from.
		let addresses = {};
		if (indexToUpdate === 'addressIndex') {
			addresses = this.data.addresses[addressType];
		} else {
			addresses = this.data.changeAddresses[addressType];
		}
		if (!Object.keys(addresses).length) {
			await this.addAddresses({
				addressAmount:
					indexToUpdate === 'addressIndex' ? this.gapLimitOptions.lookAhead : 0,
				addressIndex: index,
				changeAddressAmount:
					indexToUpdate === 'changeAddressIndex'
						? this.gapLimitOptions.lookAheadChange
						: 0,
				changeAddressIndex: index,
				addressType,
				saveAddresses: false
			});
		}
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
		addressType = this.addressType
	}: {
		addressType?: EAddressType;
	}): Promise<Result<string>> => {
		try {
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
				scriptHash = getScriptHash({ address, network: this._network });
				// Check that we are in possession of this scriptHash.
				if (!(scriptHash in allAddresses)) {
					// This output did not come from us.
					continue;
				}
				path = allAddresses[scriptHash].path;
				value = btcToSats(txVout.value);
				const publicKey = allAddresses[scriptHash].publicKey;
				inputs.push({
					tx_hash: input.txid,
					index: input.vout,
					tx_pos: input.vout,
					height: 0,
					address,
					scriptHash,
					path,
					value,
					publicKey
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
				} catch {}
			}
			if (!address) {
				continue;
			}
			const changeAddressScriptHash = getScriptHash({
				address,
				network: this._network
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
			return err('Unable to determine change address.');
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
		const transactions = this._data.transactions;
		const unconfirmed = this._data.unconfirmedTransactions;
		if (txid in transactions) {
			delete transactions[txid];
		}
		if (txid in unconfirmed) {
			delete unconfirmed[txid];
		}
		await this.saveWalletData('transactions', transactions);
		await this.saveWalletData('unconfirmedTransactions', unconfirmed);
	}

	/**
	 * Sets "exists" to false for a given on-chain transaction id.
	 * @param {string} txid
	 */
	async addGhostTransaction({ txid }: { txid: string }): Promise<void> {
		if (txid in this._data.transactions) {
			this._data.transactions[txid].exists = false;
		}
		await this.saveWalletData('transactions', this._data.transactions);
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
		type,
		fee
	}: {
		newTxId: string;
		oldTxId: string;
		type: EBoostType;
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
			this._data.boostedTransactions = {
				...this.data.boostedTransactions,
				...boostedTransaction
			};

			// Only delete the old transaction if it was an RBF
			if (type === EBoostType.rbf) {
				await this.deleteOnChainTransactionById({ txid: oldTxId });
			}

			await this.saveWalletData(
				'boostedTransactions',
				this._data.boostedTransactions
			);
			return ok(boostedTx);
		} catch (e) {
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
		return await this.transaction.resetSendTransaction();
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

	/**
	 * Creates a BIP32Interface from the selected wallet's mnemonic and passphrase
	 * @returns {Promise<Result<BIP32Interface>>}
	 */
	getBip32Interface = async (): Promise<Result<BIP32Interface>> => {
		try {
			const network = networks[this._network];
			const seed = await bip39.mnemonicToSeed(this._mnemonic, this._passphrase);
			const root = bip32.fromSeed(seed, network);
			return ok(root);
		} catch (e) {
			return err(e);
		}
	};

	/**
	 * Adds a specified input to the current transaction.
	 * @param {IUtxo} input
	 * @returns {Result<IUtxo[]>}
	 */
	public addTxInput({ input }: { input: IUtxo }): Result<IUtxo[]> {
		try {
			if (input.value < TRANSACTION_DEFAULTS.dustLimit) {
				return err('Input value is below dust limit.');
			}
			const txData = this.transaction.data;
			const inputs = txData?.inputs ?? [];
			const newInputs = [...inputs, input];
			this.transaction.updateSendTransaction({
				transaction: {
					inputs: newInputs
				}
			});
			return ok(newInputs);
		} catch (e) {
			console.log(e);
			return err(e);
		}
	}

	/**
	 * Removes the specified input from the current transaction.
	 * @param {IUtxo} input
	 * @returns {Result<IUtxo[]>}
	 */
	public removeTxInput({ input }: { input: IUtxo }): Result<IUtxo[]> {
		try {
			const txData = this.transaction.data;
			const txInputs = txData?.inputs ?? [];
			const newInputs = txInputs.filter((txInput) => {
				if (!objectsMatch(input, txInput)) {
					return txInput;
				}
			});
			this.transaction.updateSendTransaction({
				transaction: {
					inputs: newInputs
				}
			});
			return ok(newInputs);
		} catch (e) {
			console.log(e);
			return err(e);
		}
	}

	/**
	 * Adds a specified tag to the current transaction.
	 * @param {string} tag
	 * @returns {Result<string>}
	 */
	addTxTag({ tag }: { tag: string }): Result<string> {
		try {
			const txData = this.transaction.data;
			let tags = [...txData.tags, tag];
			tags = [...new Set(tags)]; // remove duplicates
			this.transaction.updateSendTransaction({
				transaction: {
					...txData,
					tags
				}
			});
			return ok('Tag successfully added');
		} catch (e) {
			console.log(e);
			return err(e);
		}
	}

	/**
	 * Removes a specified tag from the current transaction.
	 * @param {string} tag
	 * @returns {Result<string>}
	 */
	removeTxTag({ tag }: { tag: string }): Result<string> {
		try {
			const txData = this.transaction.data;
			const tags = txData.tags;
			const newTags = tags.filter((t) => t !== tag);

			this.transaction.updateSendTransaction({
				transaction: {
					...txData,
					tags: newTags
				}
			});
			return ok('Tag successfully added');
		} catch (e) {
			console.log(e);
			return err(e);
		}
	}

	/**
	 * Updates the fee rate for the current transaction to the preferred value if none set.
	 * @param {number} [satsPerByte]
	 * @param {EFeeId} [selectedFeeId]
	 * @returns {Result<string>}
	 */
	setupFeeForOnChainTransaction({
		satsPerByte,
		selectedFeeId
	}: {
		satsPerByte?: number;
		selectedFeeId?: EFeeId;
	}): Result<string> {
		try {
			const transactionData = this.transaction.data;
			if (!satsPerByte) {
				satsPerByte = transactionData?.satsPerByte ?? 1;
				satsPerByte =
					this.selectedFeeId === EFeeId.none
						? satsPerByte
						: this.feeEstimates[this.selectedFeeId];
			}
			const res = this.transaction.updateFee({
				satsPerByte: satsPerByte ?? 1,
				selectedFeeId
			});
			if (res.isErr()) {
				console.log(res.error.message);
				return err(res.error.message);
			}

			return ok('Fee has been changed successfully');
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Used to temporarily update the balance until the Electrum server catches up after sending a transaction.
	 * @param {number} balance
	 * @returns {Result<string>}
	 */
	public updateWalletBalance({ balance }: { balance: number }): Result<string> {
		try {
			this._data.balance = balance;
			this.saveWalletData('balance', balance);
			return ok('Successfully updated balance.');
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Updates the fee estimates for the current network.
	 * @public
	 * @async
	 * @param {boolean} [forceUpdate] Ignores the timestamp if set true and forces the update
	 * @returns {Promise<Result<IOnchainFees>>}
	 */
	public async updateFeeEstimates(
		forceUpdate = false
	): Promise<Result<IOnchainFees>> {
		const timestamp = this.feeEstimates.timestamp;
		const difference = Math.floor((Date.now() - timestamp) / 1000);
		if (!forceUpdate && difference < 60) {
			return ok(this.feeEstimates);
		}
		const feeEstimates = await this.getFeeEstimates();
		this.feeEstimates = feeEstimates;
		await this.saveWalletData('feeEstimates', feeEstimates);
		return ok(feeEstimates);
	}

	/**
	 * Get addresses from a given private key.
	 * @param {string} privateKey
	 * @param {EAddressType[]} [_addressTypes]
	 * @returns {Result<IGetAddressesFromPrivateKey>}
	 */
	public getAddressesFromPrivateKey(
		privateKey: string,
		_addressTypes = getAddressTypes()
	): Result<IGetAddressesFromPrivateKey> {
		try {
			const network = this.getBitcoinNetwork();
			return getAddressesFromPrivateKey({
				privateKey,
				addrTypes: _addressTypes,
				network
			});
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Returns the balance, utxos, and keyPair info for a given private key.
	 * @async
	 * @param {string} privateKey
	 * @returns {Promise<Result<IPrivateKeyInfo>>}
	 */
	public async getPrivateKeyInfo(
		privateKey: string
	): Promise<Result<IPrivateKeyInfo>> {
		if (!privateKey) return err('No private key provided.');
		const addressesRes = this.getAddressesFromPrivateKey(privateKey);
		if (addressesRes.isErr()) {
			return err(addressesRes.error.message);
		}
		const { addresses, keyPair } = addressesRes.value;
		const addressData: TUnspentAddressScriptHashData = {};
		addresses.map(({ address, publicKey }) => {
			const scriptHash = getScriptHash({ address, network: this._network });
			addressData[scriptHash] = {
				scriptHash,
				address,
				index: 0,
				path: '',
				publicKey
			};
		});

		const getUtxoRes = await this.electrum.listUnspentAddressScriptHashes({
			addresses: addressData
		});
		if (getUtxoRes.isErr()) {
			return err(getUtxoRes.error.message);
		}
		const { balance, utxos } = getUtxoRes.value;
		if (balance < TRANSACTION_DEFAULTS.dustLimit) {
			return err('Balance is below dust limit.');
		}
		return ok({ balance, utxos, keyPair, addresses });
	}

	/**
	 * Sweeps a private key to a given address.
	 * @async
	 * @param {string} privateKey
	 * @param {string} toAddress
	 * @param {number} [satsPerByte]
	 * @param {boolean} [broadcast]
	 * @param {boolean} [combineWithWalletUtxos]
	 * @returns {Promise<Result<ISweepPrivateKeyRes>>}
	 */
	public async sweepPrivateKey({
		privateKey,
		toAddress,
		satsPerByte = this.feeEstimates.normal,
		broadcast = true,
		combineWithWalletUtxos = false
	}: ISweepPrivateKey): Promise<Result<ISweepPrivateKeyRes>> {
		const privateKeyInfo = await this.getPrivateKeyInfo(privateKey);
		if (privateKeyInfo.isErr()) {
			return err(privateKeyInfo.error.message);
		}
		const { balance, keyPair } = privateKeyInfo.value;
		let utxos = privateKeyInfo.value.utxos;
		utxos = utxos.map((utxo) => {
			return { ...utxo, keyPair };
		});
		if (combineWithWalletUtxos) {
			const walletUtxos = this.data.utxos;
			utxos = [...walletUtxos, ...utxos];
		}
		await this.transaction.resetSendTransaction();
		await this.transaction.setupTransaction({
			satsPerByte,
			utxos,
			outputs: [{ address: toAddress, value: balance, index: 0 }]
		});
		const sendMaxRes = await this.transaction.sendMax({
			address: toAddress,
			satsPerByte,
			transaction: {
				...this.transaction.data,
				outputs: [{ address: toAddress, value: balance, index: 0 }],
				inputs: utxos,
				satsPerByte
			}
		});
		if (sendMaxRes.isErr()) {
			return err(sendMaxRes.error.message);
		}
		const createRes = await this.transaction.createTransaction({});
		if (createRes.isErr()) {
			return err(createRes.error.message);
		}
		const response = {
			...createRes.value,
			balance
		};
		if (!broadcast) {
			return ok(response);
		}
		const broadcastResponse = await this.electrum.broadcastTransaction({
			rawTx: response.hex,
			subscribeToOutputAddress: false
		});
		if (broadcastResponse.isErr()) {
			return err(broadcastResponse.error.message);
		}
		response.id = broadcastResponse.value;
		return ok(response);
	}

	public getAddressInfoFromScriptHash(scriptHash: string): Result<{
		address: IAddress;
		addressType: EAddressType;
	}> {
		const addresses = this.data.addresses;
		let address: { address: IAddress; addressType: EAddressType } | undefined;
		for (const addressType in addresses) {
			if (scriptHash in addresses[addressType]) {
				address = {
					address: addresses[addressType][scriptHash],
					addressType: addressType as EAddressType
				};
				break; // Exit the loop once the address is found
			}
		}
		return address ? ok(address) : err('Address not found');
	}

	/**
	 * Allows the user to update the gap limit options.
	 * @param gapLimitOptions
	 * @returns {Promise<Result<TGapLimitOptions>>}
	 */
	public updateGapLimit(
		gapLimitOptions: TGapLimitOptions
	): Result<TGapLimitOptions> {
		if (!gapLimitOptions) {
			return err('No gap limit options provided.');
		}
		if (
			!isPositive(gapLimitOptions.lookAhead) ||
			!isPositive(gapLimitOptions.lookBehind) ||
			!isPositive(gapLimitOptions.lookAheadChange) ||
			!isPositive(gapLimitOptions.lookBehindChange)
		) {
			return err('All gap limit options must be positive.');
		}
		this.gapLimitOptions = gapLimitOptions;
		return ok(this.gapLimitOptions);
	}

	/**
	 * Returns an array of tx_hashes and their height for a given address.
	 * @param {string} address
	 * @returns {Promise<Result<TTxResult[]>>}
	 */
	public async getAddressHistory(
		address: string
	): Promise<Result<TTxResult[]>> {
		try {
			const scriptHash = getScriptHash({ address, network: this._network });
			const response = await this.electrum.getAddressScriptHashesHistory([
				scriptHash
			]);
			if (response.isErr()) {
				return err(response.error.message);
			}
			if (response.value.data[0].error?.message) {
				return err(response.value.data[0].error.message);
			}
			return ok(response.value.data[0].result);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Returns the transaction details for a given tx_hash.
	 * @param {string} tx_hash
	 * @returns {Promise<Result<TTxDetails>>}
	 */
	public async getTransactionDetails(
		tx_hash: string
	): Promise<Result<TTxDetails>> {
		try {
			const details = await this.electrum.getTransactions({
				txHashes: [{ tx_hash }]
			});
			if (details.isErr()) {
				return err(details.error.message);
			}
			if (details.value.data[0]?.error?.message) {
				return err(details.value.data[0].error.message);
			}
			return ok(details.value.data[0].result);
		} catch (e) {
			return err(e);
		}
	}

	/**
	 * Used to determine if we're able to boost a transaction either by RBF or CPFP.
	 * @param {string} txid
	 */
	public canBoost(txid: string): ICanBoostResponse {
		const failure = { canBoost: false, rbf: false, cpfp: false };
		try {
			const t =
				this._data.unconfirmedTransactions[txid] ??
				this._data.transactions[txid];

			// transaction not found
			if (!t) {
				return failure;
			}

			// transaction already confirmed
			if (t.height && t.height > 0) {
				return failure;
			}

			// balance is below the recommended base fee
			if (this.getBalance() < TRANSACTION_DEFAULTS.recommendedBaseFee) {
				return failure;
			}

			/*
			 * For an RBF, technically we can reduce the output value and apply it to the fee,
			 * but this might cause issues when paying a merchant that requested a specific amount.
			 */
			const rbf =
				this.rbf &&
				(t.rbf ?? false) &&
				t.type === EPaymentType.sent &&
				t.matchedOutputValue > t.fee &&
				btcToSats(t.matchedOutputValue) >
					TRANSACTION_DEFAULTS.recommendedBaseFee;

			// Performing a CPFP tx requires a new tx and higher fee.
			const cpfp =
				btcToSats(t.matchedOutputValue) >=
				TRANSACTION_DEFAULTS.recommendedBaseFee * 3;

			return { canBoost: rbf || cpfp, rbf, cpfp };
		} catch (e) {
			return failure;
		}
	}
}
