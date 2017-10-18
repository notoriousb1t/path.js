(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.Path = factory());
}(this, (function () { 'use strict';

function parsePath(d) {
    if (Array.isArray(d)) {
        return d;
    }
    var dstrings = d.trim().split(/\s*(?=[A-Z])/i);
    var allPoints = [];
    for (var i = 0, ilen = dstrings.length; i < ilen; i++) {
        var pointArray = dstrings[i]
            .trim()
            .replace(/([^, ])-/g, '$1,-')
            .replace(/([a-z])(?![,])/gi, '$1 ')
            .split(/[\s,]+/)
            .map(function (coord, i) { return (i === 0 ? coord : +coord); });
        // This is done in a separate map so that lastPoint is parsed point
        var command = pointArray[0];
        var commandToUpper = command.toUpperCase();
        if (i !== 0 && commandToUpper !== command) {
            // adjust for relative commands
            var prev = allPoints[i - 1];
            pointArray[0] = commandToUpper;
            for (var j = 1, jlen = pointArray.length; j < jlen; j++) {
                pointArray[j] += prev[prev.length - ((j - 1) % 2 === 0 ? 2 : 1)];
            }
        }
        allPoints.push(pointArray);
    }
    return allPoints;
}

function formatPath(points, options) {
    var type = (options && options.type) || 'relative';
    return points
        .map(function (point, i, allPoints) {
        var isAbsolute = i === 0 || type === 'absolute';
        var prev = allPoints[i - 1];
        var command = isAbsolute ? point[0] : point[0].toLowerCase();
        var formatter = isAbsolute
            ? toImpreciseString
            : function (num, j) { return toImpreciseString(+num - +prev[prev.length - (j % 2 === 0 ? 2 : 1)]); };
        return (command +
            point
                .slice(1)
                .map(formatter)
                .join(','));
    })
        .join('');
}
function toImpreciseString(num) {
    return num.toFixed(1).replace('.0', '');
}

var C = 'C';
var S = 'S';
var M = 'M';
var L = 'L';

function slopeToCurve(points, prev) {
    var len = prev.length;
    var isPrevSlopeOrCurve = prev[0] === C || prev[0] === S;
    var x1 = isPrevSlopeOrCurve ? prev[len - 2] * 2 - prev[len - 4] : prev[len - 1];
    var y1 = isPrevSlopeOrCurve ? prev[len - 1] * 2 - prev[len - 3] : prev[len - 2];
    return [C, x1, y1].concat(points.slice(1));
}

/**
 * Raises an exception.  This is more or less to improve minification
 * @param message
 */
function raiseError(message) {
    throw new Error(message);
}

function reversePath(points) {
    // convert all curves to C
    var allPoints = points.map(function (num, i) {
        var command = num[0];
        if (command === M || command === L || command === C) {
            return num.slice();
        }
        if (command === S) {
            return slopeToCurve(num, points[i - 1]);
        }
        raiseError("Can't reverse that");
    });
    // Reverse
    var reversedPoints = [[M].concat(allPoints[allPoints.length - 1].splice(-2, 2))];
    // Don't hit 0: that'll just equal 'M'
    for (var i = allPoints.length - 1; i >= 1; i--) {
        // reverse arguments
        var oldPoint = allPoints[i];
        var newPoint = [oldPoint[0]];
        for (var j = oldPoint.length - 2; j > 0; j -= 2) {
            newPoint.push.apply(newPoint, oldPoint.slice(j, j + 2));
        }
        // grab coordinates from prev
        newPoint.push.apply(newPoint, allPoints[i - 1].splice(-2, 2));
        reversedPoints.push(newPoint);
    }
    return reversedPoints;
}

function mixPaths(aPoints, bPoints, x) {
    var alen = aPoints.length;
    if (alen !== bPoints.length) {
        raiseError('Paths must be equal length');
    }
    // Mix the two lines by mixing the individual points together
    var newPoints = [];
    for (var i = 0; i < alen; i++) {
        newPoints.push(mixPoints(aPoints, bPoints, i, x));
    }
    return newPoints;
}
function mixPoints(a, b, i, x) {
    var aPoint = a[i];
    var bPoint = b[i];
    var aCommand = aPoint[0];
    var bCommand = bPoint[0];
    // Check that this combination of commands is mixable
    if (!isCompatible(aCommand, bCommand)) {
        raiseError(aCommand + '+' + bCommand + 'is not supported');
    }
    // convert S -> C where possible
    if (aCommand === S && bCommand === C) {
        aPoint = slopeToCurve(aPoint, a[i - 1]);
    }
    else if (bCommand === S && aCommand === C) {
        bPoint = slopeToCurve(bPoint, b[i - 1]);
    }
    // interpolate all points
    var points = [aPoint[0]];
    for (var j = 1; j < aPoint.length; j++) {
        points.push(aPoint[j] * (1 - x) + bPoint[j] * x);
    }
    return points;
}
function isCompatible(a, b) {
    return a === b || (a === C && b === S) || (a === S && b === C);
}

// provide approximate epsilon for browser compatibility
var EPSILON = Math.pow(2, -52);
function scalePath(paths, options) {
    var loop = options && options.loop;
    var firstPath = paths[0];
    if (loop) {
        paths.push(firstPath);
    }
    var sectionSize = 1 / (paths.length - 1);
    return function (x) {
        if (loop) {
            x %= 1;
        }
        // Calculate which two paths to mix, and how much to actually mix them by
        var index = Math.floor(x / sectionSize);
        var x2 = (x % sectionSize) / sectionSize;
        var isExactX = x2 < EPSILON || index + 1 === paths.length;
        // If x lands on a path, just return the path, else mix paths
        return formatPath(isExactX ? paths[index] : mixPaths(paths[index], paths[index + 1], x2));
    };
}

var path = function Path(source) {
    if (source instanceof Path) {
        return source;
    }
    if (!(this instanceof Path)) {
        return new Path(source);
    }
    this.points = parsePath(source);
};
path.mix = function (a, b, x) {
    if (x == null) {
        x = 0.5;
    }
    return path(mixPaths(parsePath(a), parsePath(b), x));
};
path.scale = function (pathStrings, options) {
    return scalePath(pathStrings.map(parsePath), options);
};
function reverse(pathSource) {
    return formatPath(reversePath(path(pathSource).points));
}
path.reverse = reverse;
path.prototype.reverse = function () {
    return reverse(this.points);
};
path.prototype.d = path.prototype.toString = function (options) {
    return formatPath(this.points, options);
};

return path;

})));
//# sourceMappingURL=path.js.map
