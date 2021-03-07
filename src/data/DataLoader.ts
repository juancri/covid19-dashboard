
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
	public static async loadTree(): Promise<DataTree>
	{
		const today = DateTime.local();
		const dataWeeks = DateDataLoader.loadWeeks(today);
		return {
			header: {
				title: 'Chile',
				date: DateDataLoader.loadDate(today)
			},
			weeks: dataWeeks,
			beds: await BedsDataLoader.load(),
			deaths: DeathsDataLoader.load(dataWeeks),
			newCases: await NewCasesDataLoader.load(dataWeeks),
			positivity: PositivityDataLoader.load(dataWeeks),
			vaccination: await VaccinationDataLoader.load()
		};
	}
}
