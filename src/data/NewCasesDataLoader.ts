
import { DateTime } from "luxon";
import Enumerable from 'linq';

import GraphGenerator from "../drawing/GraphGenerator";
import SvgPathGenerator from "../drawing/SvgPathGenerator";
import { Box, DataWeek, DataWeeklyTrend, DataWeeklyTrends, DataWeeks, GraphConfiguration, Row } from "../Types";
import CsvDownloader from "../util/CsvDownloader";
import NumberSuffix from "../util/NumberSuffix";
import ScaleGenerator from "../util/ScaleGenerator";

const DATE_FORMAT = 'yyyy-MM-dd';
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const DATE_OPTIONS = { zone: 'UTC' };
const URL = 'https://github.com/MinCiencia/Datos-COVID19/raw/master/output/producto3/CasosTotalesCumulativo.csv'
const BOX_1: Box = {
	left: 142.1,
	right: 378.1,
	top: 405.9,
	bottom: 894.1
};
const BOX_2: Box = {
	left: 378.1,
	right: 612.5,
	top: 405.9,
	bottom: 894.1
};
const BOX_3: Box = {
	left: 612.5,
	right: 839.6,
	top: 405.9,
	bottom: 894.1
};

export default class NewCasesDataLoader
{
	public static async load(weeks: DataWeeks): Promise<DataWeeklyTrends>
	{
		const rows = await CsvDownloader.get(URL);
		const row = rows.find(r => r.Region === 'Total');
		if (!row)
			throw new Error('Total row not found');
		const rowDiff = this.getDiffValues(row);
		const rowAvg7 = this.getAvg7(rowDiff);
		const graphValues1 = Array.from(this.getGraphValues(rowAvg7, weeks.first));
		const graphValues2 = Array.from(this.getGraphValues(rowAvg7, weeks.second));
		const graphValues3 = Array.from(this.getGraphValues(rowAvg7, weeks.third));
		const graphValues4 = Array.from(this.getGraphValues(rowDiff, weeks.first));
		const graphValues5 = Array.from(this.getGraphValues(rowDiff, weeks.second));
		const graphValues6 = Array.from(this.getGraphValues(rowDiff, weeks.third));
		const allValues = [ ...graphValues1, ...graphValues2, ...graphValues3, ...graphValues4, ...graphValues5, ...graphValues6 ];
		const scale = ScaleGenerator.generate(
			allValues, BOX_3.right, BOX_3.bottom, BOX_3.top,
			x => NewCasesDataLoader.generateLabel(x));

		return {
			scale: scale,
			week1: this.getWeek(row, { scale, box: BOX_1 }, graphValues1, graphValues4, weeks.first),
			week2: this.getWeek(row, { scale, box: BOX_2 }, graphValues2, graphValues5, weeks.second),
			week3: this.getWeek(row, { scale, box: BOX_3 }, graphValues3, graphValues6, weeks.third)
		};
	}

	private static getWeek(row: Row, config: GraphConfiguration, avgValues: number[], rawValues: number[], week: DataWeek): DataWeeklyTrend
	{
		const value3 = this.getValue(row, week.to);
		const value2 = this.getValue(row, week.from);
		const value1 = this.getValue(row, week.from.plus({ days: -7 }));
		const currentWeek = value3 - value2;
		const previousWeek = value2 - value1;

		const avgPoints = GraphGenerator.generate(config, avgValues);
		const avgPath = SvgPathGenerator.generate(avgPoints);

		const rawPoints = GraphGenerator.generate(config, rawValues);
		const rawPath = SvgPathGenerator.generate(rawPoints);

		return {
			graph: avgPath,
			rawGraph: rawPath,
			lastGraphValue: avgPoints[avgPoints.length - 1].y,
			up: currentWeek > previousWeek,
			valueFormatted: NumberSuffix.format(currentWeek),
			value: currentWeek
		};
	}

	private static getDiffValues(row: Row): Row
	{
		const dates = Object
			.keys(row)
			.filter(k => DATE_REGEX.exec(k));
		const newRow = { ...row };
		for (const currentDate of dates)
		{
			const previousDate = DateTime
				.fromISO(currentDate, DATE_OPTIONS)
				.plus({ days: -1 })
				.toFormat(DATE_FORMAT);
			if (!dates.includes(previousDate))
				continue;

			const previousValue = this.getNumber(row[previousDate]);
			const currentValue = this.getNumber(row[currentDate]);
			const diff = currentValue - previousValue;
			newRow[currentDate] = diff;
		}

		return newRow;
	}

	private static getAvg7(row: Row): Row
	{
		const dates = Object
			.keys(row)
			.filter(k => DATE_REGEX.exec(k));
		const newRow = { ...row };
		for (const currentDate of dates)
		{
			const previousDates = Array.from(this.getPreviousDates(currentDate));
			if (previousDates.some(d => !dates.includes(d)))
				continue;
			const previousValues = previousDates
				.map(d => this.getNumber(row[d]));
			const avg = Enumerable
				.from(previousValues)
				.average();
			newRow[currentDate] = avg;
		}
		return newRow;
	}

	private static *getPreviousDates(dateString: string): Generator<string>
	{
		const date = DateTime.fromISO(dateString, DATE_OPTIONS);
		for (let days = -6; days <= 0; days++)
			yield date.plus({ days }).toISODate() ?? '';
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

	private static *getGraphValues(row: Row, week: DataWeek): Generator<number>
	{
		for (let current = week.from; +current <= +week.to; current = current.plus({ days: 1 }))
			yield this.getValue(row, current);
	}

	private static generateLabel(value: number): string
	{
		return value >= 1_000 ?
			Math.floor(value / 1000) + 'k' :
			value.toString();
	}
}
