import net from 'net';
import BitcoinJsonRpc from 'bitcoin-json-rpc';
import ElectrumClient from 'bw-electrum-client';
import {
	EProtocol,
	sleep,
	TMessageDataMap,
	TMessageKeys,
	TOnMessage
} from '../src';

export const bitcoinURL = 'http://polaruser:polarpass@127.0.0.1:43782';
export const electrumHost = '127.0.0.1';
export const electrumPort = 60001;

export type TWaitForElectrum = () => Promise<void>;

/*
 * This function is used to wait for Electrum to sync with Bitcoin Core.
 */
export const initWaitForElectrumToSync = async (
	elAddr: { port: number; host: string },
	btcAddr: string,
	timeout = 30_000
): Promise<TWaitForElectrum> => {
	let height = 0;

	const bitcoin = new BitcoinJsonRpc(btcAddr);
	const electrum = new ElectrumClient(
		net,
		false,
		elAddr.port,
		elAddr.host,
		EProtocol.tcp
	);

	electrum.subscribe.on('blockchain.headers.subscribe', (params) => {
		// get max height
		const h = params
			.map(({ height: hh }) => hh)
			.sort()
			.reverse()[0];
		height = h;
	});

	await electrum.initElectrum({ client: 'wait-for-block', version: '1.4' });

	const tip = await electrum.blockchainHeaders_subscribe();
	height = tip.height;

	const waitForElectrum = (): Promise<void> => {
		return new Promise(async (resolve, reject) => {
			let count: number;
			let running = true;

			const timer = setTimeout(async () => {
				running = false;
				// before timeout check block count once again
				const b = await bitcoin.getBlockCount();
				const e = await electrum.blockchainHeaders_subscribe();
				if (b === e.height) {
					resolve();
				} else {
					reject(new Error('Electrum sync Timeout error'));
				}
			}, timeout);

			try {
				count = await bitcoin.getBlockCount();
			} catch (e) {
				clearTimeout(timer);
				reject(e);
				return;
			}

			while (running && count !== height) {
				await sleep(10);
			}

			if (running) {
				clearTimeout(timer);
				resolve();
			}
		});
	};

	waitForElectrum.close = (): void => electrum?.close();

	return waitForElectrum;
};

type TMessage = {
	key: TMessageKeys;
	data: TMessageDataMap[keyof TMessageDataMap];
	timestamp: number;
};

export class MessageListener {
	public messages: TMessage[] = [];
	private resolvers: ((message: TMessage) => void)[] = [];

	onMessage: TOnMessage = (key, data) => {
		const message: TMessage = {
			key,
			data,
			timestamp: Date.now()
		};
		this.messages.push(message);
		this.resolvers.forEach((resolve) => resolve(message));
	};

	waitFor<K extends TMessageKeys>(
		messageKey: K,
		timeout = 20000
	): Promise<TMessageDataMap[K]> {
		// Check if message already received
		const existingMessage = this.messages.find((msg) => msg.key === messageKey);
		if (existingMessage) {
			return Promise.resolve(existingMessage.data as TMessageDataMap[K]);
		}

		// Wait for new message
		return new Promise((resolve, reject) => {
			const timer = setTimeout(() => {
				reject(new Error('Timeout waiting for message'));
			}, timeout);

			const resolver = (msg: TMessage): void => {
				if (msg.key === messageKey) {
					clearTimeout(timer);
					resolve(msg.data as TMessageDataMap[K]);
				}
			};
			this.resolvers.push(resolver);
		});
	}

	clear(): void {
		this.messages = [];
		this.resolvers = [];
	}
}
