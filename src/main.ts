
import { DateTime } from "luxon";
import DataLoader from "./data/DataLoader";
import DataWriter from "./data/DataWriter";
import TemplateManager from "./template/TemplateManager";

const DATE_OPTIONS = { zone: 'utc' };

(async() =>
{
	try
	{
		const inputDate = process.argv[2];
		const today = inputDate ?
			DateTime.fromISO(inputDate, DATE_OPTIONS) :
			DateTime.utc().startOf('day');
		const data = await DataLoader.loadTree(today);
		DataWriter.write(data);
		const svgPath = TemplateManager.write(data);
		console.log(svgPath);
	}
	catch (e)
	{
		console.log(e);
	}
})();
