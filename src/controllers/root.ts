import { Request, Response } from 'express';
import endpointsJson from '../endpoints.json';

export function endpoints(request: Request, response: Response) {
	response.status(200).json({
		success: true,
		data: { endpoints: endpointsJson },
	});
}
