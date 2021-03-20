import ScaleGenerator from "../util/ScaleGenerator";

test('501 should be max 600 and steps 100 (7 points)', () => {
	const scale = ScaleGenerator.generate([1, 2, 3, 501], 0, 0, 100, x => x.toString());
	expect(scale.max).toBe(600);
	expect(scale.circles.length).toBe(7);
});

test('9,000+ should be max 10,000 and step 2,000 (6 points)', () => {
	const scale = ScaleGenerator.generate([1, 2, 3, 9_001], 0, 0, 100, x => x.toString());
	expect(scale.max).toBe(10_000);
	expect(scale.circles.length).toBe(6);
});

test('500 should be max 500 and step 100 (6 points)', () => {
	const scale = ScaleGenerator.generate([1, 2, 3, 500], 0, 0, 100, x => x.toString());
	expect(scale.max).toBe(500);
	expect(scale.circles.length).toBe(6);
});

test('250 should be max 300 and step 100 (4 points)', () => {
	const scale = ScaleGenerator.generate([1, 2, 3, 250], 0, 0, 100, x => x.toString());
	expect(scale.max).toBe(300);
	expect(scale.circles.length).toBe(4);
});

test('99 should be max 100 and step 20 (6 points)', () => {
	const scale = ScaleGenerator.generate([1, 2, 3, 99], 0, 0, 100, x => x.toString());
	expect(scale.max).toBe(100);
	expect(scale.circles.length).toBe(6);
});
