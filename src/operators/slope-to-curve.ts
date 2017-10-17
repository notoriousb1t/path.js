import { C, S } from '../constants';

export function slopeToCurve(points: any[], prev: any[]) {
	const len = prev.length;
	const isPrevSlopeOrCurve = prev[0] === C || prev[0] === S;
	const x1 = isPrevSlopeOrCurve ? prev[len - 2] * 2 - prev[len - 4] : prev[len - 1];
	const y1 = isPrevSlopeOrCurve ? prev[len - 1] * 2 - prev[len - 3] :  prev[len - 2];

	return [C, x1, y1].concat(points.slice(1));
}
