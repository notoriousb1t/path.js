import { slopeToCurve } from './slope-to-curve';
import { raiseError } from '../utilities/exception';
import { C, S } from '../constants';

export function mixPaths(aPoints: any[][], bPoints: any[][], x: number) {
  const alen = aPoints.length;
  if (alen !== bPoints.length) {
    raiseError('Paths must be equal length');
  }

  // Mix the two lines by mixing the individual points together
  const newPoints = [];
  for (let i = 0; i < alen; i++) {
    newPoints.push(mixPoints(aPoints, bPoints, i, x));
  }
  return newPoints;
}

function mixPoints(a: any[][], b: any[][], i: number, x: number) {
  let aPoint = a[i];
  let bPoint = b[i];
  const aCommand = aPoint[0];
  const bCommand = bPoint[0];

  // Check that this combination of commands is mixable
  if (!isCompatible(aCommand, bCommand)) {
    raiseError(aCommand + '+' + bCommand + 'is not supported');
  }

  // convert S -> C where possible
  if (aCommand === S && bCommand === C) {
    aPoint = slopeToCurve(aPoint, a[i - 1]);
  } else if (bCommand === S && aCommand === C) {
    bPoint = slopeToCurve(bPoint, b[i - 1]);
  }

  // interpolate all points
  const points = [aPoint[0]];
  for (let j = 1; j < aPoint.length; j++) {
    points.push(aPoint[j] * (1 - x) + bPoint[j] * x);
  }
  return points;
}

function isCompatible(a: string, b: string) {
  return a === b || (a === C && b === S) || (a === S && b === C);
}
