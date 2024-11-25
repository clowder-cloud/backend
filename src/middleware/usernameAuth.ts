import { Request, Response, NextFunction } from 'express';
import * as users from '../models/users';

export default function usernameAuth(
	request: Request,
	response: Response,
	next: NextFunction
) {
	try {
		if (!request.headers.authorization)
			throw new Error('401 - You are not authorized');

		users.getUserByUsername(request.headers.authorization).then((user) => {
			if (!user)
				throw new Error(
					'401 - You have supplied an authorization header, but the user is invalid'
				);
			next(user);
		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (e: any) {
		if (e instanceof Error && e.message.startsWith('401 - ')) {
			response
				.status(401)
				.json({ success: false, message: e.message.replace('401 - ', '') });
		} else
			response.status(500).json({
				success: false,
				message: 'An internal server error occurred.',
			});
	}
}
