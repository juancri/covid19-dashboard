import { DataWeeklyTrends, DataWeeks } from "../Types";

export default class NewCasesDataLoader
{
	public static load(_weeks: DataWeeks): DataWeeklyTrends
	{
		return {
			week1: {
				graph: '',
				up: true,
				value: 11
			},
			week2: {
				graph: '',
				up: false,
				value: 21
			},
			week3: {
				graph: '',
				up: true,
				value: 31
			}
		};
	}
}
