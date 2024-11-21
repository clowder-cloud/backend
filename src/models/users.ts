import extendedClient from '../db/client';

export function getUserByUsername(username: string) {
	return extendedClient.user.findFirst({
		where: {
			username: username,
		},
	});
}

export function updateUser(userId: string, data: object) {
	return extendedClient.user.update({
		where: {
			id: userId,
		},
		data,
	});
}
