
import { DateTime } from 'luxon';

import { DataHeaderData, DataWeek, DataWeeks } from "../Types";

const DAY_FORMAT = 'dd/MM';
const DAY_OF_MONTH_FORMAT = 'dd';
const MONTHS = new Map<number, string>([
	[1, 'enero'],
	[2, 'febrero'],
	[3, 'marzo'],
	[4, 'abril'],
	[5, 'mayo'],
	[6, 'junio'],
	[7, 'julio'],
	[8, 'agosto'],
	[9, 'septiembre'],
	[10, 'octubre'],
	[11, 'noviembre'],
	[12, 'diciembre']
]);
const WEEKDAYS = new Map<number, string>([
	[1, 'lunes'],
	[2, 'martes'],
	[3, 'miércoles'],
	[4, 'jueves'],
	[5, 'viernes'],
	[6, 'sábado'],
	[7, 'domingo']
]);

export default class DateDataLoader
{
	public static loadDate(today: DateTime): DataHeaderData
	{
		return {
			dayOfMonth: today.day,
			dayOfMonthFormatted: today.toFormat(DAY_OF_MONTH_FORMAT),
			dayOfWeek: WEEKDAYS.get(today.weekday) || '',
			month: MONTHS.get(today.month) || ''
		};
	}

	public static loadWeeks(today: DateTime): DataWeeks
	{
		return {
			first: DateDataLoader.loadWeek(today, 1),
			second: DateDataLoader.loadWeek(today, 2),
			third: DateDataLoader.loadWeek(today, 3),
		}
	}

	private static loadWeek(today: DateTime, weekNumber: number): DataWeek
	{
		const from = today.plus({ days: -7 * (4 - weekNumber) });
		const to = today.plus({ days: -7 * (3 - weekNumber) });
		return {
			from,
			to,
			fromFormatted: from.toFormat(DAY_FORMAT),
			toFormatted: to.toFormat(DAY_FORMAT)
		}
	}
}
