import fs from 'fs/promises';
import { TGetData, TSetData, IWalletData } from '../src';
import { err, Result, ok } from '../src';
import { getDefaultWalletData } from '../src';

export const getData: TGetData = async <K extends keyof IWalletData>(
	key: string
): Promise<Result<IWalletData[K]>> => {
	try {
		const data = await fs.readFile(`walletData/${key}.json`, 'utf8');
		const walletData: IWalletData[K] = JSON.parse(data);
		if (walletData) return ok(walletData);
		const defaultWalletData = getDefaultWalletData();
		return ok(defaultWalletData[key]);
	} catch (e) {
		const defaultWalletData = getDefaultWalletData();
		return ok(defaultWalletData[key]);
	}
};

export const setData: TSetData = async <K extends keyof IWalletData>(
	key: string,
	value: IWalletData[K]
): Promise<Result<boolean>> => {
	try {
		await fs.writeFile(
			`walletData/${key}.json`,
			JSON.stringify(value, null, 2)
		);
		return ok(true);
	} catch (e) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return err(e);
	}
};

export const onMessage = (id, data): void => {
	console.log(id);
	console.dir(data, { depth: null });
};
