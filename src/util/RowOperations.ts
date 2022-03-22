import { Operation, Row } from "../Types";

const NUMBER_TYPE = 'number';
const MINUS_OPERATION = (n1: number, n2: number) => n1 - n2;

export default class RowOperations
{
	public static minus(row1: Row, row2: Row, ...ignore: string[]): Row
	{
		return RowOperations.combineTwo(row1, row2, MINUS_OPERATION, ignore);
	}

	private static combineTwo(row1: Row, row2: Row, op: Operation, ignore: string[]): Row
	{
		const row3: Row = {};
		const keys = Object.keys(row1).filter(key => !ignore.includes(key));
		for (const key of keys)
		{
			const value1 = RowOperations.getNumber(row1[key]);
			const value2 = RowOperations.getNumber(row2[key]);
			row3[key] = op(value1, value2);
		}
		return row3;
	}

	private static getNumber(value: number | string): number
	{
		const type = typeof value;
		if (type === NUMBER_TYPE)
			return value as number;
		const s = value as string;
		if (s.length === 0)
			return 0;
		return parseInt(s);
	}
}
