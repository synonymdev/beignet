import { ok, err, Result } from './result';
import { BLOCKTANK_HOST } from '../wallet/constants';
import { IExchangeRates } from '../types';

export const mostUsedExchangeTickers = {
	USD: {
		currencySymbol: '$',
		quote: 'USD',
		quoteName: 'US Dollar'
	},
	GBP: {
		currencySymbol: '£',
		quote: 'GBP',
		quoteName: 'Great British Pound'
	},
	CAD: {
		currencySymbol: '$',
		quote: 'CAD',
		quoteName: 'Canadian Dollar'
	},
	CNY: {
		currencySymbol: '¥',
		quote: 'CNY',
		quoteName: 'Chinese Yuan Renminbi'
	},
	EUR: { currencySymbol: '€', quote: 'EUR', quoteName: 'Euro' }
};

type TTicker = {
	symbol: string;
	lastPrice: string;
	base: string;
	baseName: string;
	quote: string;
	quoteName: string;
	currencySymbol: string;
	currencyFlag: string;
	lastUpdatedAt: number;
};

/**
 * Returns the exchange rate for the given currency
 * @returns {Promise<Result<IExchangeRates>>}
 */
export const getExchangeRates = async (): Promise<Result<IExchangeRates>> => {
	try {
		const response = await fetch(`${BLOCKTANK_HOST}/fx/rates/btc`);
		const { tickers } = await response.json();

		const rates: IExchangeRates = tickers.reduce(
			(acc: IExchangeRates, ticker: TTicker) => {
				return {
					...acc,
					[ticker.quote]: {
						currencySymbol: ticker.currencySymbol,
						quote: ticker.quote,
						quoteName: ticker.quoteName,
						rate: Math.round(Number(ticker.lastPrice) * 100) / 100,
						lastUpdatedAt: ticker.lastUpdatedAt
					}
				};
			},
			{}
		);

		return ok(rates);
	} catch (e) {
		return err(e);
	}
};
