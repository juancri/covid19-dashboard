
import Enumerable from 'linq';

import { Circle, Scale } from "../Types";

type FormatNumber = (x: number) => string;

export default class ScaleGenerator
{
	public static generate(values: number[], x: number, minY: number, maxY: number, format: FormatNumber): Scale
	{
		const min = 0;
		const max = this.getScaleMax(values);
		const circles = Array.from(this.getCircles(max, x, minY, maxY, format));
		return { min, max, circles };
	}

	public static generateFixed(max: number, steps: number, x: number, minY: number, maxY: number, format: FormatNumber): Scale
	{
		const min = 0;
		const circles = Array.from(this.getCircles(max, x, minY, maxY, format, steps));
		return { min, max, circles }
	}

	private static *getCircles(max: number, x: number, minY: number, maxY: number, format: FormatNumber, steps = 5): Generator<Circle>
	{
		const step = max / steps;
		const rangeY = maxY - minY;
		for (let current = 0; current <= max; current += step)
		{
			const ratio = current / max;
			const y = minY + rangeY * ratio;
			yield {
				position: { x, y },
				value: current,
				valueFormatted: format(current)
			};
		}
	}

	private static getScaleMax(values: number[]): number
	{
		const maxValue = Enumerable
			.from(values)
			.where(v => !!v)
			.max();
		const length = Math.log10(maxValue);
		const nextPow = Math.ceil(length);
		const nextValue = Math.pow(10, nextPow);
		const ratio = nextValue / maxValue;
		return ratio < 2 ?
			nextValue :
			nextValue / 2;
	}
}
