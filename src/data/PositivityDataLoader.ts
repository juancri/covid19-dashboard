import { DateTime } from "luxon";
import { DataWeek, DataWeeklyTrends, DataWeeks, Row } from "../Types";
import CsvDownloader from "../util/CsvDownloader";

const URL = 'https://github.com/MinCiencia/Datos-COVID19/raw/master/output/producto49/Positividad_Diaria_Media.csv';

export default class PositivityDataLoader
{

	public static async load(weeks: DataWeeks): Promise<DataWeeklyTrends>
	{
		const rows = await CsvDownloader.get(URL);
		const row = rows.find(r => r.Fecha === 'mediamovil_positividad');
		if (!row)
			throw new Error('Cannot find row: mediamovil_positividad');

		return {
			week1: this.loadWeek(row, weeks.first),
			week2: this.loadWeek(row, weeks.second),
			week3: this.loadWeek(row, weeks.third)
		};
	}

	private static loadWeek(row: Row, week: DataWeek)
	{
		const previous = this.getValue(row, week.from);
		const current = this.getValue(row, week.to);
		return {
			graph: '',
			up: current > previous,
			value: current
		};
	}

	private static getValue(row: Row, date: DateTime): number
	{
		const num = this.getNumber(row[date.toISODate()]);
		return Math.round(num * 100);
	}

	private static getNumber(input: number | string): number
	{
		return typeof input === 'number' ?
			input :
			parseFloat(input);
	}
}
