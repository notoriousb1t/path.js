import { Path } from './path';
import { getPathString } from './get-path-string';
import { reversePath } from './reverse-path';
import { mixPaths } from './mix-paths';
import { scalePath } from './scale-path';

Path.prototype.reverse = reversePath;
Path.prototype.d = getPathString;
Path.prototype.toString = getPathString;

Path.mix = mixPaths;
Path.scale = scalePath;

Path.reverse = function reversePath(path) {
	return new Path(path).reverse().d();
};

export default Path;
