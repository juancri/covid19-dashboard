import { DataBeds } from "../Types";
import CsvDownloader from "../util/CsvDownloader";

const URL = 'https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto20/NumeroVentiladores_T.csv';

export default class BedsDataLoader
{
	public static async load(): Promise<DataBeds>
	{
		const rows = await CsvDownloader.get(URL);
		const last = rows[rows.length - 1];
		const available = this.getNumber(last.disponibles);
		const lastUpdate = '';
		const used = this.getNumber(last.ocupados);
		const total = this.getNumber(last.total);
		const usedPercentage = Math.round((used / total) * 100);

		return { available, lastUpdate, usedPercentage };
	}

	private static getNumber(input: number | string): number
	{
		return typeof input === 'number' ?
			input :
			parseInt(input);
	}
}

