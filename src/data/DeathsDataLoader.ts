
import { DateTime } from "luxon";
import { DataWeek, DataWeeklyTrend, DataWeeklyTrends, DataWeeks, Row } from "../Types";
import CsvDownloader from "../util/CsvDownloader";

const DATE_FORMAT = 'yyyy-MM-dd';
const URL = 'https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto5/TotalesNacionales.csv';

export default class DeathsDataLoader
{
	public static async load(weeks: DataWeeks): Promise<DataWeeklyTrends>
	{
		const rows = await CsvDownloader.get(URL);
		const row = rows.find(r => r.Fecha === 'Fallecidos');
		if (!row)
			throw new Error('Cannot find row for Fallecidos');

		return {
			week1: this.getWeek(row, weeks.first),
			week2: this.getWeek(row, weeks.second),
			week3: this.getWeek(row, weeks.third)
		};
	}

	private static getWeek(row: Row, week: DataWeek): DataWeeklyTrend
	{
		const value3 = this.getValue(row, week.to);
		const value2 = this.getValue(row, week.from);
		const value1 = this.getValue(row, week.from.plus({ days: -7 }));

		const currentWeek = value3 - value2;
		const previousWeek = value2 - value1;

		return {
			graph: '', // TODO: Implement
			up: currentWeek > previousWeek,
			value: currentWeek
		};
	}

	private static getValue(row: Row, date: DateTime): number
	{
		return this.getNumber(row[date.toFormat(DATE_FORMAT)]);
	}

	private static getNumber(input: string | number): number
	{
		return typeof input === 'string' ?
			parseInt(input) :
			input;
	}
}
