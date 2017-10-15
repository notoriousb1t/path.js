import { Path, pointArray } from './path';
import { getPathString } from './get-path-string';
import { reversePath } from './reverse-path';
import { mixPaths } from './mix-paths';
import { scalePath } from './scale-path';

Path.prototype = {
	reverse() {
		return reversePath(this.points);
	},
	d: getPathString,
	toString: getPathString
};

Path.mix = mixPaths;
Path.scale = scalePath;

Path.reverse = path => {
	return reversePath(Path(path).points).d();
};

export default Path;
