import { mixPaths } from './mix-paths';
import { Path } from './path';
import { slopeToCurve } from './slope-to-curve';
import { C, S } from './constants';

export function scalePath(pathStrings, options) {
	const loop = options && options.loop;

	const paths = pathStrings.map(Path);
	const pointLength = paths[0].points.length;

	// Check that what we're trying to do is actually possible with this lib
	for (let j = 1, jlen = paths.length; j < jlen; j++) {
		let points = paths[j].points;
		if (points.length !== pointLength) {
			throw new Error('Both paths must be equal length');
		}

		points.forEach((point, i) => {
			if (!mixable(point[0], paths[0].points[i][0])) {
				throw new Error('Commands must match');
			}
		});
	}

	if (loop) {
		paths.push(paths[0]);
	}

	const sectionSize = 1 / (paths.length - 1);

	return x => {
		if (loop) {
			x %= 1;
		}

		// Calculate which two paths to mix, and how much to actually mix them by
		const index = Math.floor(x / sectionSize);
		const realX = (x % sectionSize) / sectionSize;

		// If x lands on a path, just return the path
		if (realX < Number.EPSILON || index + 1 === paths.length) {
			return paths[index];
		}

		return mixPaths(paths[index], paths[index + 1], realX);
	};
}

function mixable(a, b) {
	return a === b || (a === C && b === S) || (a === S && b === C);
}
