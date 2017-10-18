export function formatPath(points: any[], options?: { type?: string }) {
  const type = (options && options.type) || 'relative';

  return points
    .map((point, i, allPoints) => {
      const isAbsolute = i === 0 || type === 'absolute';
      const prev = allPoints[i - 1];

      const command = isAbsolute ? point[0] : point[0].toLowerCase();
      const formatter = isAbsolute
        ? toImpreciseString
        : (num, j) => toImpreciseString(+num - +prev[prev.length - (j % 2 === 0 ? 2 : 1)]);

      return (
        command +
        point
          .slice(1)
          .map(formatter)
          .join(',')
      );
    })
    .join('');
}

function toImpreciseString(num: number) {
  return num.toFixed(1).replace('.0', '');
}
