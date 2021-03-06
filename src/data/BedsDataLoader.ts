import { DataBeds } from "../Types";

export default class BedsDataLoader
{
	public static load(): DataBeds
	{
		return {
			available: 10,
			lastUpdate: '01/02',
			usedPercentage: 11
		};
	}
}

