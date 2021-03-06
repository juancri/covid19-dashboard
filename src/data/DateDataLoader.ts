
import { DateTime } from 'luxon';

import { DataHeaderData, DataWeek, DataWeeks } from "../Types";

const DAY_FORMAT = 'dd/MM';
const MONTHS = new Map<number, string>([
	[2, 'febrero']
]);
const WEEKDAYS = new Map<number, string>([
	[7, 'domingo']
]);
const TODAY = DateTime.local();

export default class DateDataLoader
{
	public static loadDate(): DataHeaderData
	{
		return {
			dayOfMonth: TODAY.day,
			dayOfMonthIsShort: TODAY.day < 10,
			dayOfWeek: WEEKDAYS.get(TODAY.weekday) || '',
			month: MONTHS.get(TODAY.month) || ''
		};
	}

	public static loadWeeks(): DataWeeks
	{
		return {
			first: DateDataLoader.loadWeek(1),
			second: DateDataLoader.loadWeek(2),
			third: DateDataLoader.loadWeek(3),
		}
	}

	private static loadWeek(weekNumber: number): DataWeek
	{
		const firstDay = TODAY.plus({ days: -7 * (4 - weekNumber) });
		const lastDay = TODAY.plus({ days: -7 * (3 - weekNumber) });
		return {
			from: firstDay.toFormat(DAY_FORMAT),
			to: lastDay.toFormat(DAY_FORMAT)
		}
	}
}
