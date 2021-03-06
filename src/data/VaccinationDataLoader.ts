
import Enumerable from 'linq';
import formatNumber from 'format-number';

import { DataVaccination, DataVaccinationDose, Row } from "../Types";
import CsvDownloader from "../util/CsvDownloader";

const POPULATION = 19_212_361;
const URL = 'https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto76/vacunacion_std.csv';
const FORMAT = formatNumber({ });

export default class VaccinationDataLoader
{
	public static async load(): Promise<DataVaccination>
	{
		const rows = await CsvDownloader.get(URL);
		const first = this.getData(rows, 'Primera');
		const second = this.getData(rows, 'Segunda');
		return { first, second };
	}

	private static getData(rows: Row[], doseName: string): DataVaccinationDose
	{
		const qty = this.getQuantity(rows, doseName);
		const ratio = qty / POPULATION;
		return {
			percent: Math.round(ratio * 100),
			quantity: FORMAT(qty),
			size: ratio * 450 + 5,
		};
	}

	private static getQuantity(rows: Row[], doseName: string): number
	{
		return Enumerable
			.from(rows)
			.where(r => r.Region === 'Total')
			.where(r => r.Dosis === doseName)
			.select(r => this.getNumber(r.Cantidad))
			.last();
	}

	private static getNumber(input: number | string): number
	{
		return typeof input === 'number' ?
			input :
			parseInt(input);
	}
}
