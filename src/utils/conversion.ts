import { default as bitcoinUnits } from 'bitcoin-units';
import { EUnit } from '../types';

/**
 * Converts a value in BTC to satoshis
 * @param {number} value
 * @returns {number}
 */
export const btcToSats = (value: number): number => {
	try {
		return Number(bitcoinUnits(value, 'BTC').to('satoshi').value().toFixed(0));
	} catch {
		return 0;
	}
};

/**
 * Converts a value in satoshis to BTC
 * @param {number} value
 * @returns {number}
 */
export const satsToBtc = (value: number): number => {
	return bitcoinUnits(value, 'sats').to('BTC').value();
};

/**
 * Converts an amount of currency in a specific unit to satoshis
 * @param {number} value
 * @param {EUnit} unit
 * @param {number} exchangeRate
 * @param {string} currency
 */
export const convertToSats = (
	value: number | string,
	unit: EUnit,
	exchangeRate: number,
	currency = 'EUR'
): number => {
	const amount = Number(value);

	if (unit === EUnit.BTC) {
		return btcToSats(amount);
	}

	if (unit === EUnit.fiat) {
		return fiatToBitcoinUnit({
			fiatValue: amount,
			unit: EUnit.satoshi,
			exchangeRate,
			currency
		});
	}

	return amount;
};

/**
 * Converts a fiat value to a bitcoin unit.
 * @param {string | number} fiatValue
 * @param {number} exchangeRate
 * @param {string} currency
 * @param {EUnit} unit
 * @returns {number}
 */
export const fiatToBitcoinUnit = ({
	fiatValue,
	exchangeRate,
	currency,
	unit
}: {
	fiatValue: string | number;
	exchangeRate: number;
	currency: string;
	unit: EUnit;
}): number => {
	try {
		// this throws if exchangeRate is 0
		bitcoinUnits.setFiat(currency, exchangeRate);
		const value = bitcoinUnits(Number(fiatValue), currency)
			.to(unit)
			.value()
			.toFixed(unit === EUnit.satoshi ? 0 : 8); // satoshi cannot be a fractional number

		return Number(value);
	} catch {
		return 0;
	}
};
