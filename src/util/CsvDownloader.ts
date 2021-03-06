
import axios from 'axios';
import parse from 'csv-parse/lib/sync';

import { Row } from '../Types';

const CSV_OPTIONS = { columns: true };

export default class CsvDownloader
{
	public static async get(url: string): Promise<Row[]>
	{
		const res = await axios.get(url);
		return parse(res.data, CSV_OPTIONS);
	}
}
