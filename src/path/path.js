export function Path(d) {
	if (!(this instanceof Path)) {
		return new Path(d);
	}

	this.points = Array.isArray(d) ? d : pointArray(d);
}

export function pointArray(d) {
	const dstrings = d.trim().split(/\s*(?=[A-Z])/i);

	const allPoints = [];
	for (let i = 0, ilen = dstrings.length; i < ilen; i++) {
		const pointArray = dstrings[i]
			.trim()
			// These two replaces are to simplify the split regex
			.replace(/([^, ])-/g, '$1,-')
			.replace(/([a-z])(?![,])/gi, '$1 ')
			.split(/[\s,]+/)
			.map((coord, i) => (i === 0 ? coord : +coord));

		// This is done in a separate map so that lastPoint is parsed point
		const command = pointArray[0];
		const commandToUpper = command.toUpperCase();

		if (i !== 0 && commandToUpper !== command) {
			// adjust for relative commands
			const prev = allPoints[i - 1];
			pointArray[0] = commandToUpper;

			for (let j = 1, jlen = pointArray.length; j < jlen; j++) {
				pointArray[j] += prev[prev.length - ((j - 1) % 2 === 0 ? 2 : 1)];
			}
		}

		allPoints.push(pointArray);
	}

	return allPoints;
}
