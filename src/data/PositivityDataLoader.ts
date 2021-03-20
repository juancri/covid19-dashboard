
import Enumerable from 'linq';
import { DateTime } from "luxon";
import formatNumber from 'format-number';

import GraphGenerator from "../drawing/GraphGenerator";
import SvgPathGenerator from "../drawing/SvgPathGenerator";
import { Box, DataWeek, DataWeeklyTrend, DataWeeklyTrends, DataWeeks, GraphConfiguration, Row } from "../Types";
import CsvDownloader from "../util/CsvDownloader";
import ScaleGenerator from '../util/ScaleGenerator';

const FORMAT = formatNumber({
	integerSeparator: '.',
	decimal: ',',
	truncate: 1,
	suffix: '%'
});
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const DATE_OPTIONS = { zone: 'UTC' };
const URL = 'https://github.com/MinCiencia/Datos-COVID19/raw/master/output/producto49/Positividad_Diaria_Media.csv';
const BOX_1: Box = {
	left: 1_117.2,
	right: 1_352.6,
	top: 1266.3,
	bottom: 1754.2
};
const BOX_2: Box = {
	left: 1_352.6,
	right: 1_587,
	top: 1266.3,
	bottom: 1754.2
};
const BOX_3: Box = {
	left: 1_587,
	right: 1_816.4,
	top: 1266.3,
	bottom: 1754.2
};


export default class PositivityDataLoader
{

	public static async load(weeks: DataWeeks): Promise<DataWeeklyTrends>
	{
		const rows = await CsvDownloader.get(URL);
		const row = rows.find(r => r.Fecha === 'mediamovil_positividad');
		if (!row)
			throw new Error('Cannot find row: mediamovil_positividad');
		const rowAvg7 = this.getAvg7(row);
		const graphValues1 = Array.from(this.getGraphValues(rowAvg7, weeks.first));
		const graphValues2 = Array.from(this.getGraphValues(rowAvg7, weeks.second));
		const graphValues3 = Array.from(this.getGraphValues(rowAvg7, weeks.third));
		const scale = ScaleGenerator.generateFixed(20, 4, BOX_3.right, BOX_3.bottom, BOX_3.top, x => `${x}%`);

		return {
			scale: scale,
			week1: this.getWeek(row, { scale, box: BOX_1 }, graphValues1, weeks.first),
			week2: this.getWeek(row, { scale, box: BOX_2 }, graphValues2, weeks.second),
			week3: this.getWeek(row, { scale, box: BOX_3 }, graphValues3, weeks.third)
		};
	}

	private static getWeek(row: Row, config: GraphConfiguration, graphValues: number[], week: DataWeek): DataWeeklyTrend
	{
		const previous = this.getValue(row, week.from);
		const current = this.getValue(row, week.to);
		const graphPoints = GraphGenerator.generate(config, graphValues);
		const path = SvgPathGenerator.generate(graphPoints);
		const value = current;

		return {
			graph: path,
			lastGraphValue: graphPoints[graphPoints.length - 1].y,
			up: current > previous,
			valueFormatted: FORMAT(value),
			value,
		};
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
			yield date.plus({ days }).toISODate();
	}

	private static getValue(row: Row, date: DateTime): number
	{
		const num = this.getNumber(row[date.toISODate()]);
		return num * 100;
	}

	private static getNumber(input: number | string): number
	{
		return typeof input === 'number' ?
			input :
			parseFloat(input);
	}

	private static *getGraphValues(row: Row, week: DataWeek): Generator<number>
	{
		for (let current = week.from; +current <= +week.to; current = current.plus({ days: 1 }))
			yield this.getValue(row, current);
	}
}
