
import * as fs from 'fs';
import * as path from 'path';

import Handlebars from 'handlebars';
import * as tmp from 'tmp-promise';

import { DataTree } from "../Types";

const TEMPLATE_PATH = path.join(__dirname, '../../images/base.svg');
const TEMPLATE_STRING = fs.readFileSync(TEMPLATE_PATH).toString();
const TEMPLATE = Handlebars.compile(TEMPLATE_STRING);

export default class TemplateManager
{
	public static write(data: DataTree): string
	{
		const tempPath = tmp.fileSync({ postfix: '.svg' });
		const output = TEMPLATE(data);
		fs.writeFileSync(tempPath.name, output);
		return tempPath.name;
	}
}
