import * as electrum from 'rn-electrum-client/helpers';
import { err, ok, Result } from './result';

import {
	EAvailableNetworks,
	ElectrumConnectionPubSub,
	ElectrumConnectionSubscription,
	IFormattedPeerData,
	TProtocol
} from '../types';
import * as hardcodedPeers from 'rn-electrum-client/helpers/peers.json';

const POLLING_INTERVAL = 1000 * 20;
export const defaultElectrumPorts = ['51002', '50002', '51001', '50001'];

/**
 * Returns the default port for the given network and protocol.
 * @param {EAvailableNetworks} [selectedNetwork]
 * @param {string} [protocol]
 * @returns {number}
 */
export const getDefaultPort = (
	selectedNetwork: EAvailableNetworks,
	protocol: TProtocol
): number => {
	if (protocol === 'ssl') {
		return selectedNetwork === 'testnet' ? 51002 : 50002;
	} else {
		return selectedNetwork === 'testnet' ? 51001 : 50001;
	}
};

/**
 * Returns the protocol for the given network and default port.
 * @param {string} [port]
 * @param {EAvailableNetworks} [network]
 * @returns {TProtocol | undefined}
 */
export const getProtocolForPort = (
	port: string,
	network: EAvailableNetworks
): TProtocol | undefined => {
	if (port === '443') {
		return 'ssl';
	}

	if (network === 'testnet') {
		return port === '51002' ? 'ssl' : 'tcp';
	}

	return port === '50002' ? 'ssl' : 'tcp';
};

/**
 * Formats the peer data response from an Electrum server.
 * @param {[string, string, [string, string, string]]} data
 * @returns Result<IFormattedPeerData>
 */
export const formatPeerData = (
	data: [string, string, [string, string, string]]
): Result<IFormattedPeerData> => {
	try {
		if (!data) {
			return err('No data provided.');
		}
		if (data?.length !== 3) {
			return err('Invalid peer data');
		}
		if (data[2]?.length < 2) {
			return err('Invalid peer data');
		}
		const [ip, host, ports] = data;
		const [version, ssl, tcp] = ports;
		return ok({
			ip,
			host,
			version,
			ssl,
			tcp
		});
	} catch (e) {
		if (typeof e === 'string' || e instanceof Error) {
			return err(e);
		}
		return err('Unable to format peer data.');
	}
};

/**
 * Returns an array of peers.
 * If unable to acquire peers from an Electrum server the method will default to the hardcoded peers in peers.json.
 * @param {EAvailableNetworks} [selectedNetwork]
 * @returns Promise<Result<IFormattedPeerData[]>>
 */
export const getPeers = async ({
	selectedNetwork
}: {
	selectedNetwork: EAvailableNetworks;
}): Promise<Result<IFormattedPeerData[]>> => {
	try {
		const response = await electrum.getPeers({ network: selectedNetwork });
		if (!response.error) {
			// Return an array of peers provided by the currently connected electrum server.
			const peers: IFormattedPeerData[] = [];
			await Promise.all(
				response.data.map(async (peer) => {
					const formattedPeer = await formatPeerData(peer);
					if (formattedPeer.isOk()) {
						peers.push(formattedPeer.value);
					}
				})
			);
			if (peers?.length > 0) {
				return ok(peers);
			}
		}
		// No peers available grab hardcoded peers instead.
		return ok(hardcodedPeers[selectedNetwork]);
	} catch (e) {
		if (typeof e === 'string' || e instanceof Error) {
			return err(e);
		}
		return err('Unable to get peers.');
	}
};

/**
 * Background task that checks the connection to the Electrum server with a PubSub
 * If connection was lost this will try to reconnect in the specified interval
 * @param {() => Result<null>} [connectToElectrum]
 * @returns {ElectrumConnectionPubSub}
 */
export const electrumConnection = ((
	connectToElectrum?: () => Result<null>
): ElectrumConnectionPubSub => {
	const subscribers: Set<(isConnected: boolean) => void> = new Set();
	let latestState: boolean | null = null;

	setInterval(async () => {
		try {
			const { error } = await electrum.pingServer();

			if (error) {
				if (connectToElectrum) {
					console.log('Connection to Electrum Server lost, reconnecting...');
					const response = await connectToElectrum();

					if (response.isErr()) {
						electrumConnection.publish(false);
					}
				}
			} else {
				electrumConnection.publish(true);
			}
		} catch (e) {
			console.error(e);
		}
	}, POLLING_INTERVAL);

	const publish = (isConnected: boolean): void => {
		// Skip if no subscribers
		if (subscribers.size === 0) {
			return;
		}

		// Skip if state hasn't changed
		if (latestState === isConnected) {
			return;
		}

		latestState = isConnected;
		subscribers.forEach((callback) => callback(isConnected));
	};

	const subscribe = (
		callback: (isConnected: boolean) => void
	): ElectrumConnectionSubscription => {
		subscribers.add(callback);

		return {
			remove: (): void => {
				subscribers.delete(callback);
			}
		};
	};

	return { publish, subscribe };
})();
