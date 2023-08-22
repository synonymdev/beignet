import { promises as fs } from 'fs';
import { TGetData, TSetData, IWalletData } from '../src';
import { err, Result, ok } from '../src';
import { getDefaultWalletData } from '../src';

export const getData: TGetData = async <K extends keyof IWalletData>(
	key: string
): Promise<Result<IWalletData[K]>> => {
	try {
		const data = await fs.readFile(`example/walletData/${key}.json`, 'utf8');
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
		const dir = 'example/walletData';
		// Ensure that the directory exists
		await fs.mkdir(dir, { recursive: true });

		await fs.writeFile(`${dir}/${key}.json`, JSON.stringify(value, null, 2));
		return ok(true);
	} catch (e) {
		// @ts-ignore
		return err(e);
	}
};

export const onMessage = (id, data): void => {
	console.log(id);
	console.dir(data, { depth: null });
};
