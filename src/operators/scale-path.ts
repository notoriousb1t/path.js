import { mixPaths } from './mix-path';
import { parsePath } from './parse-path';
import { C, S } from '../constants';
import { formatPath } from './format-path';
import { raiseError } from '../utilities/exception';

// provide approximate epsilon for browser compatibility
const EPSILON = 2 ** -52;

export function scalePath(paths: any[][], options?: { loop?: boolean }) {
	const loop = options && options.loop;
	const firstPath = paths[0];
	
	if (loop) {
		paths.push(firstPath);
	}

	const sectionSize = 1 / (paths.length - 1);

	return (x: number) => {
		if (loop) {
			x %= 1;
		}

		// Calculate which two paths to mix, and how much to actually mix them by
		const index = Math.floor(x / sectionSize); 
		const x2 = (x % sectionSize) / sectionSize;
		const isExactX = x2 < EPSILON || index + 1 === paths.length;
		
		// If x lands on a path, just return the path, else mix paths
		return formatPath(isExactX ? paths[index] : mixPaths(paths[index], paths[index + 1], x2));
	};
}
