export function getPathString(options) {
	const type = (options && options.type) || 'relative';

	return this.points
		.map((point, i, allPoints) => {
			if (i === 0 || type === 'absolute') {
				return (
					point[0] +
					point
						.slice(1)
						.map(toImpreciseString)
						.join(',')
				);
			}

			const prev = allPoints[i - 1];

			return (
				point[0].toLowerCase() +
				point
					.slice(1)
					.map((num, j) => {
						return toImpreciseString(num - prev[prev.length - (j % 2 === 0 ? 2 : 1)]);
					})
					.join(',')
			);
		})
		.join('');
}

function toImpreciseString(num) {
	return num.toFixed(1).replace('.0', '');
}
