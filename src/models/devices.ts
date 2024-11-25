import extendedClient from '../db/client';

export async function createDevice(username: string) {
	return extendedClient.user
		.findFirst({
			where: {
				username: username,
			},
		})
		.then((user) => {
			if (!user) throw new Error(`user does not exist`);
			return extendedClient.device.create({
				data: {
					owner_id: user.id,
				},
			});
		});
}

export async function fetchDevicesByUserID(id: string) {
	return extendedClient.device
		.findMany({
			where: {
				owner_id: id,
			},
		})
		.then((data) => data);
}

export async function updateDevice(
	uuid: string,
	data: { lat: number; lon: number }
) {
	const currentInformation = await extendedClient.device.findFirst({
		where: {
			uuid: uuid,
		},
	});

	if (!currentInformation) throw new Error('unregistered device');

	const history = currentInformation.location_history;

	if (
		currentInformation.last_location.lat &&
		currentInformation.last_location.lon
	) {
		history.push({
			lat: currentInformation.last_location.lat,
			lon: currentInformation.last_location.lon,
			timestamp: new Date().toISOString(),
		});
		// We have previous data. Lets push it to the history before we overwrite
	}

	return extendedClient.device.update({
		where: {
			uuid: uuid,
		},
		data: {
			last_pulse_at: new Date(),
			last_location: { lat: data.lat, lon: data.lon },
			location_history: history,
		},
	});
}

export function deleteDevice(id: string) {
	return extendedClient.device.delete({
		where: {
			id: id,
		},
	});
}
