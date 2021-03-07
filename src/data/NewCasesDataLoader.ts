
import { DateTime } from "luxon";
import { DataWeek, DataWeeklyTrend, DataWeeklyTrends, DataWeeks, Row } from "../Types";
import CsvDownloader from "../util/CsvDownloader";

const DATE_FORMAT = 'yyyy-MM-dd';
const URL = 'https://github.com/MinCiencia/Datos-COVID19/raw/master/output/producto3/CasosTotalesCumulativo.csv'

export default class NewCasesDataLoader
{
	public static async load(weeks: DataWeeks): Promise<DataWeeklyTrends>
	{
		const rows = await CsvDownloader.get(URL);
		const row = rows.find(r => r.Region === 'Total');
		if (!row)
			throw new Error('Total row not found');

		return {
			week1: this.getWeek(row, weeks.first),
			week2: this.getWeek(row, weeks.second),
			week3: this.getWeek(row, weeks.third)
		};
	}

	private static getWeek(row: Row, week: DataWeek): DataWeeklyTrend
	{
		const previousWeek = this.getValue(row, week.from);
		const currentWeek = this.getValue(row, week.to);
		return {
			graph: '', // TODO: Implement
			up: currentWeek > previousWeek,
			value: currentWeek - previousWeek
		};
	}

	private static getValue(row: Row, date: DateTime): number
	{
		return this.getNumber(row[date.toFormat(DATE_FORMAT)]);
	}

	private static getNumber(input: number | string): number
	{
		return typeof input === 'number' ?
			input :
			parseInt(input);
	}
}
