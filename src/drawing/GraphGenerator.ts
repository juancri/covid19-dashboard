
import { GraphConfiguration, Point, Scale, Box } from "../Types";

const EXPECTED_VALUES = 8;

export default class GraphGenerator
{
	public static generate(config: GraphConfiguration, values: number[]): Point[]
	{
		if (values.length !== EXPECTED_VALUES)
			throw new Error(`Expected ${EXPECTED_VALUES} values. Got ${values.length}.`);

		const rawPoints = this.generateRawPoints(values);
		const ratioPoints = this.generateRatioPoints(config.scale, rawPoints);
		const scaledPoints = this.generateScaledPoints(config.box, ratioPoints);
		return scaledPoints;
	}

	private static generateRawPoints(values: number[]): Point[]
	{
		return values.map((value, index) => ({ x: index, y: value }));
	}

	private static generateRatioPoints(scale: Scale, points: Point[]): Point[]
	{
		return points.map(p => ({
			x: this.getRatio(0, EXPECTED_VALUES - 1, p.x),
			y: this.getRatio(scale.min, scale.max, p.y)
		}));
	}

	private static getRatio(min: number, max: number, value: number): number
	{
		const rest = value - min;
		return rest / max;
	}

	private static generateScaledPoints(box: Box, points: Point[]): Point[]
	{
		return points.map(p => ({
			x: this.scaleValue(box.left, box.right, p.x),
			y: this.scaleValue(box.bottom, box.top, p.y)
		}));
	}

	private static scaleValue(min: number, max: number, value: number): number
	{
		const range = max - min;
		return min + range * value;
	}
}
