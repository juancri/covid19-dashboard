
import fs from 'fs';

import { DataTree } from "../Types";

const FILE_PATH = '/tmp/dashboard.json';

export default class DataWriter
{
	public static write(data: DataTree): void
	{
		const dataString = JSON.stringify(data);
		fs.writeFileSync(FILE_PATH, dataString);
	}
}
