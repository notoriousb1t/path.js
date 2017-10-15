export function slopeToCurve(points, prev) {
	let len = prev.length;

	let x1, y1;
	if (prev[0] === 'C' || prev[0] === 'S') {
		x1 = prev[len - 2] * 2 - prev[len - 4];
		y1 = prev[len - 1] * 2 - prev[len - 3];
	} else {
		x1 = prev[len - 1];
		y1 = prev[len - 2];
	}

	return ['C', x1, y1, ...points.slice(1)];
}