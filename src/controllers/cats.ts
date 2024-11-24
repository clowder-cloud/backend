import { Request, Response, NextFunction } from 'express';
import validator from '../utils/validator';
import * as cats from '../models/cats';
import { type User } from '@prisma/client';

export function createCat(
	user: User,
	request: Request,
	response: Response,
	next: NextFunction
) {
	const schema = {
		name: 'string',
		description: 'string,optional',
		picture_url: 'string,optional',
	};
	const payload = request.body;
	const result = validator(payload, schema);

	if (!result.success) return next({ status: 400, message: result.errors });

	cats.createCat(user.id, result.body).then((cat) => {
		return response.status(201).json({ success: true, data: cat });
	});
}

export function updateCat(
	user: User,
	request: Request,
	response: Response,
	next: NextFunction
) {
	const schema = {
		cat_id: 'string',
		name: 'string,optional',
		description: 'string,optional',
		picture_url: 'string,optional',
	};

	const payload = request.body;
	const result = validator(payload, schema);

	if (!result.success) return next({ status: 400, message: result.errors });

	cats.fetchCatsByUserID(user.id).then((usersCats) => {
		// ensure that the authenticated user owns the cat
		const catMatch = usersCats.find((cat) => cat.id === result.body.cat_id);
		if (!catMatch) throw new Error('no cat found');

		delete result.body.cat_id;
		cats.updateCat(catMatch.id, result.body).then((updated_cat) => {
			response.status(200).json({ success: true, data: updated_cat });
		});
	});
}
