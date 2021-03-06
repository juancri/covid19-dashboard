import { DataWeeklyTrends, DataWeeks } from "../Types";

export default class DeathsDataLoader
{
	public static load(_weeks: DataWeeks): DataWeeklyTrends
	{
		return {
			week1: {
				graph: '',
				up: true,
				value: 10
			},
			week2: {
				graph: '',
				up: false,
				value: 20
			},
			week3: {
				graph: '',
				up: true,
				value: 30
			}
		};
	}
}
