import { DataWeeklyTrends, DataWeeks } from "../Types";

export default class PositivityDataLoader
{
	public static load(_weeks: DataWeeks): DataWeeklyTrends
	{
		return {
			week1: {
				graph: '',
				up: true,
				value: 12
			},
			week2: {
				graph: '',
				up: false,
				value: 22
			},
			week3: {
				graph: '',
				up: true,
				value: 32
			}
		};
	}
}
