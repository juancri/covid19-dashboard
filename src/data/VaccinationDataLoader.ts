import { DataVaccination } from "../Types";

export default class VaccinationDataLoader
{
	public static load(): DataVaccination
	{
		return {
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
		};
	}
}
