
import { DateTime } from "luxon";
import { DataTree } from "../Types";
import BedsDataLoader from "./BedsDataLoader";
import DateDataLoader from "./DateDataLoader";
import DeathsDataLoader from "./DeathsDataLoader";
import NewCasesDataLoader from "./NewCasesDataLoader";
import PositivityDataLoader from "./PositivityDataLoader";
import VaccinationDataLoader from "./VaccinationDataLoader";

export default class DataLoader
{
	public static async loadTree(today: DateTime): Promise<DataTree>
	{
		const dataWeeks = DateDataLoader.loadWeeks(today);
		return {
			header: {
				title: 'CHILE',
				date: DateDataLoader.loadDate(today)
			},
			weeks: dataWeeks,
			beds: await BedsDataLoader.load(),
			deaths: await DeathsDataLoader.load(dataWeeks),
			newCases: await NewCasesDataLoader.load(dataWeeks),
			positivity: await PositivityDataLoader.load(dataWeeks),
			vaccination: await VaccinationDataLoader.load()
		};
	}
}
