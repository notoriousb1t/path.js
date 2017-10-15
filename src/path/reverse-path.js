import { Path } from './path'
import { slopeToCurve } from './slope-to-curve'

export function reversePath() {
	// convert all curves to C
	const points = this.points.map((num, i) => {
		if (num[0] === 'M' || num[0] === 'L' || num[0] === 'C') {
			return num.slice();
		}

		if (num[0] === 'S') {
			return slopeToCurve(num, this.points[i - 1]);
		}

		throw new Error('Reversing paths with that in is not yet supported, sorry');
	});

	// Reverse
	const reversedPoints = [['M', ...points[points.length - 1].splice(-2, 2)]];

	// Don't hit 0: that'll just equal 'M'
	for (let i = points.length - 1; i >= 1; i--) {
		// reverse arguments
		const oldPoint = points[i];
		const newPoint = [oldPoint[0]];

		for (let j = oldPoint.length - 2; j > 0; j -= 2) {
			newPoint.push(...oldPoint.slice(j, j + 2));
		}

		// grab coordinates from prev
		newPoint.push(...points[i - 1].splice(-2, 2));

		reversedPoints.push(newPoint);
	}

	return new Path(reversedPoints);
}