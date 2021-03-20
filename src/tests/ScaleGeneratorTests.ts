import ScaleGenerator from "../util/ScaleGenerator";


test('Base is > 0.5', () => {
	const scale = ScaleGenerator.generate([1, 2, 3, 501], 0, 0, 100, x => x.toString());
	expect(scale.max).toBe(1000);
});

test('Base is = 0.5', () => {
	const scale = ScaleGenerator.generate([1, 2, 3, 500], 0, 0, 100, x => x.toString());
	expect(scale.max).toBe(500);
});

test('Base is < 0.5', () => {
	const scale = ScaleGenerator.generate([1, 2, 3, 499], 0, 0, 100, x => x.toString());
	expect(scale.max).toBe(500);
});
