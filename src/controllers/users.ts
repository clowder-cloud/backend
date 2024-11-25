import { Request, Response, NextFunction } from 'express';
import * as devices from '../models/devices';
import * as cats from '../models/cats';
import * as users from '../models/users';
import validator from '../utils/validator';
import { type User } from '@prisma/client';

export function getDevices(request: Request, response: Response) {
	const { id } = request.params;
	devices.fetchDevicesByUserID(id).then((data) => {
		response.json({
			success: true,
			data: data,
		});
	});
}

export function getCats(request: Request, response: Response) {
	const { id } = request.params;
	cats.fetchCatsByUserID(id).then((data) => {
		response.json({
			success: true,
			data: data,
		});
	});
}

export function getUser(
	user: User,
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (user) {
		res.status(200).json({ sucess: true, data: user });
	} else {
		next({ status: 500, message: 'An internal server error occurred' });
	}
}

export function updateUser(
	user: User,
	req: Request,
	res: Response,
	next: NextFunction
) {
	const schema = {
		requested_privacy: 'string',
	};
	const payload = req.body;
	const result = validator(payload, schema);

	if (!result.success) return next({ status: 400, message: result.errors });

	users
		.updateUser(user.username, req.body)
		.then((updatedUser) => {
			res.status(200).json({ sucess: true, data: updatedUser });
		})
		.catch(() => {
			res.status(500).send({ msg: 'An internal server error occurred' });
		});
}

export function getAllUsers(request: Request, response: Response) {
	users.getAll().then((data) => {
		response
			.status(200)
			.json({ success: true, data: data, count: data.length });
	});
}
