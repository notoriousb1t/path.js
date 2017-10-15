import { Path } from './path'
import { slopeToCurve } from './slope-to-curve';

export function mixPaths(a, b, x = 0.5) {
	if (!(a instanceof Path)) {
		a = new Path(a);
	}
	if (!(b instanceof Path)) {
		b = new Path(b);
	}

	const alen = a.points.length
	if (a.points.length !== b.points.length) {
		throw new Error('Paths must be equal length');
	}

	// Mix the two lines by mixing the individual points together
	const newPoints = []
	for (let i = 0; i < alen; i++) {
		newPoints.push(mixPoints(a, b, i, x))
	}

	return new Path(newPoints);
}

function mixPoints(a, b, i, x) {
	let aPoints = a.points[i];
	let bPoints = b.points[i];
	let aCommand = aPoints[0]
	let bCommand = bPoints[0]

	if (aCommand === 'S' && bCommand === 'C') {
		aPoints = slopeToCurve(aPoints, a.points[i - 1]);
	} else if (bCommand === 'S' && aCommand === 'C') {
		bPoints = slopeToCurve(bPoints, b.points[i - 1]);
	}

	if (aPoints[0] !== bPoints[0]) {
		throw new Error("Mixing S and C isn't supported");	
	}
	
	const newPoints = aPoints.slice(1).map((num, j) => num * (1 - x) + bPoints[j + 1] * x);
	return [aPoints[0], ...newPoints];
}