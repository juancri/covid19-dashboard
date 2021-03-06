
import { DataTree } from "../Types";
import DateDataLoader from "./DateDataLoader";

export default class DataLoader
{
	public static loadTree(): DataTree
	{
		return {
			header: {
				title: 'Chile',
				date: DateDataLoader.loadDate()
			},
			weeks: DateDataLoader.loadWeeks(),
			beds: {
				available: 10,
				lastUpdate: '01/02',
				usedPercentage: 11
			},
			deaths: {
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
			},
			newCases: {
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
			},
			positivity: {
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
			},
			vaccination: {
				first: {
					percent: 50,
					quantity: '1.250.000',
					size: 0.50 * 450 + 5,
				},
				second: {
					percent: 25,
					quantity: '24.000',
					size: 0.25 * 450 + 5
				}
			}
		};
	}
}
