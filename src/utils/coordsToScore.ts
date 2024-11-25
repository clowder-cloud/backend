/**
 * @author PhilTBatt
 */
export default function coordsToScore(coordinates: [number, number][]): number {
	const earthRadiusPerDegree = 111000;
	let totalLength = 0;

	for (let i = 0; i < coordinates.length - 1; i++) {
		const [lat1, lng1] = coordinates[i];
		const [lat2, lng2] = coordinates[i + 1];

		const deltaLat = lat2 - lat1;
		const deltaLng = lng2 - lng1;

		const deltaLatMeters = deltaLat * earthRadiusPerDegree;
		const deltaLngMeters =
			deltaLng * earthRadiusPerDegree * Math.cos((lat1 * Math.PI) / 180);

		totalLength += Math.sqrt(
			deltaLatMeters * deltaLatMeters + deltaLngMeters * deltaLngMeters
		);
	}

	return totalLength;
}
