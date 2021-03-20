import ScaleGenerator from "../util/ScaleGenerator";

test('500+ should be 600', () => {
	const scale = ScaleGenerator.generate([1, 2, 3, 501], 0, 0, 100, x => x.toString());
	expect(scale.max).toBe(600);
});

test('9000+ should be 10000', () => {
	const scale = ScaleGenerator.generate([1, 2, 3, 9_001], 0, 0, 100, x => x.toString());
	expect(scale.max).toBe(10_000);
});

test('500 should be 500', () => {
	const scale = ScaleGenerator.generate([1, 2, 3, 500], 0, 0, 100, x => x.toString());
	expect(scale.max).toBe(500);
});

test('99 should be 100', () => {
	const scale = ScaleGenerator.generate([1, 2, 3, 99], 0, 0, 100, x => x.toString());
	expect(scale.max).toBe(100);
});
