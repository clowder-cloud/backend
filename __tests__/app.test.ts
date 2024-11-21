import app from '../src/app';
import request from 'supertest';
import endpointsJson from '../src/endpoints.json';
import seeder from '../prisma/seed';

const server = app.listen(6666);

beforeEach(async () => {
	await seeder();
});

afterAll(() => {
	server.close();
});

describe('🧪 Express Application', () => {
	describe('Root', () => {
		describe('GET /api', () => {
			it('200: should return a successful response', () => {
				return request(app)
					.get('/api')
					.expect(200)
					.then(({ body }) => {
						expect(body).toEqual({
							success: true,
						});
					});
			});
		});

		describe('GET /api/endpoints', () => {
			const expectedData = {};
			endpointsJson.forEach((endpoint) => {
				const copy = JSON.parse(JSON.stringify(endpoint));
				delete copy.path;
				Object.assign(expectedData, {
					[endpoint.path]: {
						...copy,
					},
				});
			});
			it('200: should return a successful response', () => {
				return request(app)
					.get('/api/endpoints')
					.expect(200)
					.then(({ body: { success, data } }) => {
						expect(success).toBe(true);
						expect(data).toEqual(expectedData);
					});
			});
		});
	});

	describe('Users', () => {
		describe('GET /api/users/:id/devices', () => {
			const userWithDevices = 'cm3op7iwu0000jrcqa60tc9kv';
			const userWithoutDevices = 'cm3op7iww0001jrcqpq3qxx6i';

			it('200: should return the devices for a valid user with more than one device', () => {
				return request(app)
					.get(`/api/users/${userWithDevices}/devices`)
					.expect(200)
					.then(({ body: { success, data } }) => {
						expect(success).toBe(true);
						expect(data).not.toEqual([]);
					});
			});

			it('200: should return an empty array when given a valid user with no devices', () => {
				return request(app)
					.get(`/api/users/${userWithoutDevices}/devices`)
					.expect(200)
					.then(({ body: { success, data } }) => {
						expect(success).toBe(true);
						expect(data).toEqual([]);
					});
			});
		});

		describe('GET /api/users/:id/cats', () => {
			const userWithCats = 'cm3op7iwu0000jrcqa60tc9kv';
			const userWithoutCats = 'cm3op7iww0001jrcqpq3qxx6i';

			it('200: should return the devices for a valid user with more than one device', () => {
				return request(app)
					.get(`/api/users/${userWithCats}/cats`)
					.expect(200)
					.then(({ body: { success, data } }) => {
						expect(success).toBe(true);
						expect(data).not.toEqual([]);
					});
			});

			it('200: should return an empty array when given a valid user with no devices', () => {
				return request(app)
					.get(`/api/users/${userWithoutCats}/cats`)
					.expect(200)
					.then(({ body: { success, data } }) => {
						expect(success).toBe(true);
						expect(data).toEqual([]);
					});
			});
		});
	});

	describe('Devices', () => {
		describe('POST /api/devices/create', () => {
			it('201: should create a new device', () => {
				return request(app)
					.post('/api/devices/create')
					.set('Authorization', 'user1')
					.expect(201)
					.then(({ body: { success, data } }) => {
						expect(success).toBe(true);
						expect(data).toMatchObject({
							name: 'GPS Device',
							last_pulse_at: null,
							last_location: {},
							location_history: {},
						});
					});
			});
			it('401: should alert of no authorization', () => {
				return request(app)
					.post('/api/devices/create')
					.expect(401)
					.then(({ body: { success, message } }) => {
						expect(success).toBe(false);
						expect(message).toBe('You are not authorized');
					});
			});
		});

		describe('PATCH /api/devices/update', () => {
			it('204: should return no content on successful update', () => {
				const data = {
					id: '5804f943-4aaf-432f-83d8-62028827ac57',
					lat: 41.303921,
					lon: -81.901693,
				};
				return request(app).post('/api/devices/update').send(data).expect(204);
			});
			it('400: should return when body has an error', () => {
				const data = {
					body: {
						id: '5804f943-4aaf-432f-83d8-62028827ac57',
						lat: 41.303921,
					},
				};
				return request(app)
					.post('/api/devices/update')
					.set('Authorization', '5804f943-4aaf-432f-83d8-62028827ac57')
					.send(data)
					.expect(400);
			});
		});

		describe('DELETE /api/devices/delete', () => {
			const body = {
				device_uuid: '5804f943-4aaf-432f-83d8-62028827ac57',
			};
			it('204: should return no content on successful deletion', () => {
				return request(app)
					.delete('/api/devices/delete')
					.set('Authorization', 'user1')
					.send(body)
					.expect(204);
			});
			it('401: should return when device is not authorized', () => {
				return request(app).delete('/api/devices/delete').send().expect(401);
			});
		});
	});

	describe('Cats', () => {
		describe('POST /api/cats/create', () => {
			it('201: should create a new cat with no body', () => {
				return request(app)
					.post('/api/cats/create')
					.set('Authorization', 'user1')
					.expect(201)
					.then(({ body: { success, data } }) => {
						expect(success).toBe(true);
						expect(data).toMatchObject({
							name: null,
							description: null,
							picture_url: null,
						});
					});
			});
			it('401: should alert of no authorization', () => {
				return request(app)
					.post('/api/cats/create')
					.expect(401)
					.then(({ body: { success, message } }) => {
						expect(success).toBe(false);
						expect(message).toBe('You are not authorized');
					});
			});
		});

		describe('POST /api/cats/update', () => {
			it('204: should return no content on successful update', () => {
				const data = {
					cat_id: 'cm3pz1t0v000308jka8bl7x25',
					name: 'Daisy, Eater of Worlds',
				};
				return request(app)
					.post('/api/cats/update')
					.set('Authorization', 'user1')
					.send(data)
					.expect(200)
					.then(({ body: { success, data } }) => {
						console.log(data);
						expect(success).toBe(true);
						expect(data).toMatchObject({
							name: 'Daisy, Eater of Worlds',
						});
					});
			});
			it('400: should return when body has an error', () => {
				const data = {};
				return request(app)
					.post('/api/cats/update')
					.set('Authorization', 'user1')
					.send(data)
					.expect(400);
			});
			it('401: should return when device is not authorized', () => {
				const data = {
					cat_id: 'cm3pz1t0v000308jka8bl7x25',
					name: 'Daisy, Eater of Worlds',
				};
				return request(app).post('/api/cats/update').send(data).expect(401);
			});
		});
	});
});
