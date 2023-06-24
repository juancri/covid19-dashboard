
import Enumerable from 'linq';
import { DateTime } from "luxon";
import formatNumber from 'format-number';

import { Box, DataWeek, DataWeeklyTrend, DataWeeklyTrends, DataWeeks, GraphConfiguration, Row } from "../Types";
import GraphGenerator from "../drawing/GraphGenerator";
import SvgPathGenerator from "../drawing/SvgPathGenerator";
import CsvDownloader from "../util/CsvDownloader";
import ScaleGenerator from '../util/ScaleGenerator';
import RowOperations from '../util/RowOperations';

const FORMAT = formatNumber({ integerSeparator: '.' });
const DATE_FORMAT = 'yyyy-MM-dd';
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const DATE_OPTIONS = { zone: 'UTC' };
const URL = 'https://raw.githubusercontent.com/MinCiencia/Datos-COVID19/master/output/producto5/TotalesNacionales.csv';
const FALLECIDOS = 'Fallecidos';
const SOSPECHOSOS = 'Fallecidos sospechosos probables u otros totales';
const FECHA = 'Fecha';
const BOX_1: Box = {
	left: 144.5,
	right: 380.5,
	top: 1266.3,
	bottom: 1754.2
};
const BOX_2: Box = {
	left: 380.5,
	right: 614.9,
	top: 1266.3,
	bottom: 1754.2
};
const BOX_3: Box = {
	left: 614.9,
	right: 842,
	top: 1266.3,
	bottom: 1754.2
};

export default class DeathsDataLoader
{
	public static async load(weeks: DataWeeks): Promise<DataWeeklyTrends>
	{
		// Get data
		const rows = await CsvDownloader.get(URL);
		const fallecidos = rows.find(r => r[FECHA] === FALLECIDOS);
		if (!fallecidos)
			throw new Error('Cannot find row for Fallecidos');
		const sospechosos = rows.find(r => r[FECHA] === SOSPECHOSOS);
		if (!sospechosos)
			throw new Error('Cannot find row for Sospechosos');

		// Rest sospechosos from fallecidos
		const row = RowOperations.minus(fallecidos, sospechosos, FECHA);
		const rowDiff = this.getDiffValues(row);
		const rowAvg7 = this.getAvg7(rowDiff);

		// Average graph
		const graphValues1 = Array.from(this.getGraphValues(rowAvg7, weeks.first));
		const graphValues2 = Array.from(this.getGraphValues(rowAvg7, weeks.second));
		const graphValues3 = Array.from(this.getGraphValues(rowAvg7, weeks.third));

		// Raw graph
		const graphValues4 = Array.from(this.getGraphValues(rowDiff, weeks.first));
		const graphValues5 = Array.from(this.getGraphValues(rowDiff, weeks.second));
		const graphValues6 = Array.from(this.getGraphValues(rowDiff, weeks.third));
		const allValues = [ ...graphValues1, ...graphValues2, ...graphValues3, ...graphValues4, ...graphValues5, ...graphValues6 ];
		const scale = ScaleGenerator.generate(allValues, BOX_3.right, BOX_3.bottom, BOX_3.top, x => x.toString());

		return {
			scale,
			week1: this.getWeek(row, { scale, box: BOX_1 }, graphValues1, graphValues4, weeks.first),
			week2: this.getWeek(row, { scale, box: BOX_2 }, graphValues2, graphValues5, weeks.second),
			week3: this.getWeek(row, { scale, box: BOX_3 }, graphValues3, graphValues6, weeks.third)
		};
	}

	private static getWeek(row: Row, config: GraphConfiguration, avgGraphValues: number[], rawGraphValues: number[], week: DataWeek): DataWeeklyTrend
	{
		const value3 = this.getValue(row, week.to);
		const value2 = this.getValue(row, week.from);
		const value1 = this.getValue(row, week.from.plus({ days: -7 }));
		const currentWeek = value3 - value2;
		const previousWeek = value2 - value1;

		// Avg
		const avgGraphPoints = GraphGenerator.generate(config, avgGraphValues);
		const avgPath = SvgPathGenerator.generate(avgGraphPoints);

		// Raw
		const rawGraphPoints = GraphGenerator.generate(config, rawGraphValues);
		const rawPath = SvgPathGenerator.generate(rawGraphPoints);

		return {
			graph: avgPath,
			rawGraph: rawPath,
			lastGraphValue: avgGraphPoints[avgGraphPoints.length - 1].y,
			up: currentWeek > previousWeek,
			valueFormatted: FORMAT(currentWeek),
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

	private static getNumber(input: string | number): number
	{
		return typeof input === 'string' ?
			parseInt(input) :
			input;
	}

	private static *getGraphValues(row: Row, week: DataWeek): Generator<number>
	{
		for (let current = week.from; +current <= +week.to; current = current.plus({ days: 1 }))
			yield this.getValue(row, current);
	}
}
