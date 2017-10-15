import { mixPaths } from './mix-paths';
import { Path } from './path';
import { slopeToCurve } from './slope-to-curve';

export function scalePath(pathStrings, options) {
	options = Object.assign(
		{
			loop: false // start from 0 when loop gets above 1?
		},
		options
	);

	const paths = pathStrings.map(str => (str instanceof Path ? str : new Path(str)));
	const pointLength = paths[0].points.length;

	// Check that what we're trying to do is actually possible with this lib
	paths.forEach((path, i) => {
		if (i === 0) {
			return;
		}
		if (path.points.length !== pointLength) {
			throw new Error('Both paths have to be the same length, sorry');
		}

		path.points.forEach((point, i) => {
			if (!mixable(point[0], paths[0].points[i][0])) {
				throw new Error('Command types have to match, sorry');
			}
		});
	});

	if (options.loop) {
		paths.push(paths[0]);
	}

	const sectionSize = 1 / (paths.length - 1);

	return (x) => {
		if (options.loop) {
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
	return a === b || (a === 'C' && b === 'S') || (a === 'S' && b === 'C');
}
