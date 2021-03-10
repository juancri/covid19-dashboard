
import { Point } from "../Types";

export default class SvgPathGenerator
{
	public static generate(points: Point[]): string
	{
		if (points.length < 2)
			return '';

		const first = points[0];
		const rest = points.slice(1);
		const instructions = [
			this.generateInstruction(first, 'M'),
			...rest.map(p => this.generateInstruction(p, 'L'))
		];
		return instructions.join(' ');
	}

	private static generateInstruction(point: Point, instruction: string): string
	{
		return `${instruction}${point.x},${point.y}`;
	}
}
