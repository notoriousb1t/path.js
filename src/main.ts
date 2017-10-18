import { parsePath } from './operators/parse-path';
import { formatPath } from './operators/format-path';
import { reversePath } from './operators/reverse-path';
import { mixPaths } from './operators/mix-path';
import { scalePath } from './operators/scale-path';
import { PathInstance, PathStatic, PathSource } from './types';

const path = function Path(source: PathSource) {
	if (source instanceof Path) {
		return source as PathInstance;
	}
	if (!(this instanceof Path)) {
		return new (Path as any)(source);
	} 
	this.points = parsePath(source as string | any[][]);
} as PathStatic;

path.mix = function(a, b, x) {
	if (x == null) {
		x = 0.5;
	}
	return path(mixPaths(parsePath(a), parsePath(b), x));
};
path.scale = function(pathStrings: string[], options?: { loop?: boolean }) {
	return scalePath(pathStrings.map(parsePath), options);
};

function reverse(pathSource: PathSource) {
	return formatPath(reversePath(path(pathSource).points));
};

path.reverse = reverse;

path.prototype.reverse = function() {
	return reverse(this.points);
};

path.prototype.d = path.prototype.toString = function (options?: { type?: string }) {
	return formatPath(this.points, options);
};

export default path;
