import { Path } from './path';
import { slopeToCurve } from './slope-to-curve';
import { C, S, M, L } from './constants';

export function reversePath(points) {
	// convert all curves to C
	const allPoints = points.map((num, i) => {
		const command = num[0]
		if (command === M || command === L || command === C) {
			return num.slice();
		}

		if (command === S) {
			return slopeToCurve(num, points[i - 1]);
		}

		throw new Error('Cannot reverse that');
	});

	// Reverse
	const reversedPoints = [[M].concat(allPoints[allPoints.length - 1].splice(-2, 2))];

	// Don't hit 0: that'll just equal 'M'
	for (let i = allPoints.length - 1; i >= 1; i--) {
		// reverse arguments
		const oldPoint = allPoints[i];
		const newPoint = [oldPoint[0]];

		for (let j = oldPoint.length - 2; j > 0; j -= 2) {
			newPoint.push.apply(newPoint, oldPoint.slice(j, j + 2));
		}

		// grab coordinates from prev
		newPoint.push.apply(newPoint, allPoints[i - 1].splice(-2, 2));

		reversedPoints.push(newPoint);
	}

	return Path(reversedPoints);
}
