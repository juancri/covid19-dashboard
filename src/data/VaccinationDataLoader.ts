
import Enumerable from 'linq';
import formatNumber from 'format-number';

import { DataVaccination, DataVaccinationDose } from "../Types";
import CsvDownloader from "../util/CsvDownloader";

const POPULATION = 19_276_267;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const URL_BOOSTER = 'https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto78/vacunados_edad_fecha_Refuerzo.csv';
const URL_FOURTH = 'https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto78/vacunados_edad_fecha_Cuarta.csv';
const FORMAT = formatNumber({ integerSeparator: '.' });

export default class VaccinationDataLoader
{
	public static async load(): Promise<DataVaccination>
	{
		const booster = await this.getData(URL_BOOSTER);
		const fourth = await this.getData(URL_FOURTH);
		return { booster, fourth };
	}

	private static async getData(...urls: string[]): Promise<DataVaccinationDose>
	{
		let total = 0;
		for (const url of urls)
			total += await this.getQuantity(url);
		const ratio = total / POPULATION;
		return {
			percent: Math.round(ratio * 100),
			quantity: FORMAT(total),
			size: ratio * 450 + 5,
		};
	}

	private static async getQuantity(url: string): Promise<number>
	{
		const rows = await CsvDownloader.get(url);
		return Enumerable
			.from(rows)
			.selectMany(row => Object.keys(row).map(key => ({ row, key })))
			.where(x => ISO_DATE_REGEX.test(x.key))
			.select(x => this.getNumber(x.row[x.key]))
			.sum();
	}

	private static getNumber(input: number | string): number
	{
		if(typeof input === 'number')
			return input;
		if (!input.length)
			return 0;

		return parseFloat(input);
	}
}
