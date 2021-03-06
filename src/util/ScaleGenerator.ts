
// Dependencies
import Enumerable from 'linq';

// Local
import { Circle, Scale } from "../Types";

// Types
type FormatNumber = (x: number) => string;

interface ScaleDefinition
{
	max: number;
	step: number;
}

export default class ScaleGenerator
{
	public static generate(values: number[], x: number, minY: number, maxY: number, format: FormatNumber, minMax?: number): Scale
	{
		const min = 0;
		const max = this.getMaxValue(values, minMax);
		const scaleDef = this.generateScaleDefinition(max);
		const circles = Array.from(this.getCircles(scaleDef, x, minY, maxY, format));
		return { min, max: scaleDef.max, circles };
	}

	public static generateFixed(max: number, step: number, x: number, minY: number, maxY: number, format: FormatNumber): Scale
	{
		const min = 0;
		const circles = Array.from(this.getCircles({ max, step }, x, minY, maxY, format));
		return { min, max, circles }
	}

	private static *getCircles(scaleDef: ScaleDefinition, x: number, minY: number, maxY: number, format: FormatNumber): Generator<Circle>
	{
		const rangeY = maxY - minY;
		for (let current = 0; current <= scaleDef.max; current += scaleDef.step)
		{
			const ratio = current / scaleDef.max;
			const y = minY + rangeY * ratio;
			yield {
				position: { x, y },
				value: current,
				valueFormatted: format(current)
			};
		}
	}

	private static getMaxValue(values: number[], minMax?: number): number
	{
		const found = Enumerable
			.from(values)
			.where(v => !!v)
			.max();
		return minMax === undefined ?
			found :
			Math.max(found, minMax);
	}

	private static generateScaleDefinition(maxValue: number): ScaleDefinition
	{
		const length = Math.log10(maxValue);
		const basePow = Math.floor(length);
		const baseStep = Math.pow(10, length === basePow ? basePow - 1 : basePow);
		const ratio = maxValue / baseStep;
		const maxSteps = Math.ceil(ratio);
		const max = maxSteps * baseStep;
		const step = ratio <= 6 ?
			baseStep :
			baseStep * 2;
		return { max, step };
	}
}
