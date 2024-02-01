import { default as bitcoinUnits } from 'bitcoin-units';

/**
 * Converts a value in BTC to sats
 * @param {number} btc
 * @returns {number}
 */
export const btcToSats = (btc: number): number => {
	try {
		return Number(bitcoinUnits(btc, 'BTC').to('satoshi').value().toFixed(0));
	} catch {
		return 0;
	}
};

/**
 * Converts a value in sats to BTC
 * @param sats
 * @returns {number}
 */
export const satsToBtc = (sats: number): number => {
	return bitcoinUnits(sats, 'sats').to('BTC').value();
};
