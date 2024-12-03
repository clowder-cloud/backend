import extendedClient from '../db/client';
// Removed for demo to stop linter complaining
// import CoordinateObjectType from '../type/CoordinateObjectType';
import Coordinate from '../type/CoordinateType';
import coordsToScore from '../utils/coordsToScore';

export async function createCat(
	id: string,
	parameters?: {
		name?: string;
		description?: string;
		picture_url?: string;
	}
) {
	return extendedClient.user
		.findFirst({
			where: {
				id: id,
			},
		})
		.then((user) => {
			if (!user) throw new Error(`user does not exist`);
			return extendedClient.cat.create({
				data: {
					owner_id: user.id,
					...parameters,
				},
			});
		});
}

export async function fetchCatsByUserID(id: string) {
	return extendedClient.cat
		.findMany({
			include: {
				battle_profile: true,
			},
			where: {
				owner_id: id,
			},
		})
		.then((data) => data);
}

export async function updateCat(id: string, payload: object) {
	return extendedClient.cat.update({
		where: {
			id: id,
		},
		data: {
			...payload,
		},
	});
}

export async function getAllCatsWithRange(range: string) {
	const startDate = new Date();
	const endDate = new Date();

	switch (range) {
		case 'daily':
			startDate.setDate(startDate.getDate() - 1);
			break;
		case 'weekly':
			startDate.setDate(startDate.getDate() - 7);
			break;
		case 'monthly':
			startDate.setMonth(startDate.getMonth() - 1);
			break;
		case 'yearly':
			startDate.setFullYear(startDate.getFullYear() - 1);
			break;
		case 'all_time':
			startDate.setTime(0);
			break;
	}

	const data = await extendedClient.device.findMany({
		// Join cat onto the result
		include: {
			cat: true,
		},
		where: {
			// We don't want devices that have no data, or no associated cat
			NOT: [
				{
					last_pulse_at: null,
				},
				{
					cat: null,
				},
			],
		},
	});

	// As the location history is nested as an array in the row, we'll just have to do some
	// funky array methods. I wanted to use GTE and LTE, but apparently they don't work.
	const sortedData = data
		.map((cat) => {
			// Get all location history that we care about
			const historyInRange = cat.location_history.filter((item) => {
				const parsedTimestamp = new Date(item.timestamp);
				return parsedTimestamp > startDate && parsedTimestamp < endDate;
			});
			// Convert our history into a useable format
			const historyAsCoordinates: Coordinate[] = historyInRange.map((item) => [
				item.lat,
				item.lon,
			]);
			// Create our final coordinates array that contains current location plus all the history
			const coordinates: Coordinate[] = [
				[cat.last_location.lat, cat.last_location.lon],
				...historyAsCoordinates,
			];
			// Calculate the score
			const score = coordsToScore(coordinates);
			// Return an object with the score K:V appended
			return { ...cat, score: score };
		})
		.sort((a, b) => b.score - a.score); // Sort descending

	return sortedData;
}

export function increaseLevelAndXP(id: string, level: number, xp: number) {
	return extendedClient.battleProfile.update({
		where: {
			cat_id: id,
		},
		data: {
			level: {
				increment: level,
			},
			xp: {
				increment: xp,
			},
		},
	});
}

export function getCatsWithLastLocation() {
	// Removed for demo
	// near: CoordinateObjectType,
	// radius: number
	return extendedClient.device.findMany({
		include: {
			cat: true,
		},
		// Removed for demo
		// where: {
		// 	NOT: [
		// 		{
		// 			last_location: undefined,
		// 		},
		// 		{
		// 			cat: null,
		// 		},
		// 	],
		// 	AND: [
		// 		{
		// 			last_location: {
		// 				path: ['lat'],
		// 				gte: near.lat - radius,
		// 			},
		// 		},
		// 		{
		// 			last_location: {
		// 				path: ['lat'],
		// 				lte: near.lat + radius,
		// 			},
		// 		},
		// 	],
		// },
	});
}

export function getCatByID(id: string) {
	return extendedClient.cat.findFirst({
		where: {
			id: id,
		},
		include: {
			device: true,
			owner: true,
		},
	});
}
