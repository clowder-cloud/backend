import app from '../src/app';
import request from 'supertest';
import endpointsJson from '../src/endpoints.json';
import seeder from '../prisma/seed';
import { promisify } from 'util';
import { exec } from 'child_process';

const server = app.listen(6666);

beforeAll(async () => {
	console.log(`💽 Wiping and re-seeding`);
	await promisify(exec)('npx prisma migrate reset --force');
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
			const userWithoutDevices = 'cm417qv9r000007jp3jzj28rl';

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
			const userWithoutCats = 'cm417qv9r000007jp3jzj28rl';

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

		describe('/api/users/settings', () => {
			it('GET 200: should return user', () => {
				return request(app)
					.get('/api/users/settings')
					.set('authorization', 'user1')
					.send()
					.expect(200)
					.then(({ body }) => {
						expect(body).toMatchObject({
							sucess: true,
							data: { requested_privacy: expect.any(String) },
						});
					});
			});
			it('PATCH 200: should return updated user on successful update', () => {
				const data = {
					requested_privacy: 'PUBLIC',
				};
				return request(app)
					.patch('/api/users/settings')
					.set('authorization', 'user1')
					.send(data)
					.expect(200)
					.then(({ body }) => {
						expect(body).toMatchObject({
							sucess: true,
							data: { requested_privacy: 'PUBLIC' },
						});
					});
			});
			it('PATCH 400: should return when body has an error', () => {
				const data = {
					body: {
						notAProperty: null,
					},
				};
				return request(app)
					.patch('/api/users/settings')
					.set('authorization', 'user1')
					.send(data)
					.expect(400);
			});
		});

		describe('GET /api/users', () => {
			it('200: should get all users', () => {
				return request(app)
					.get('/api/users')
					.expect(200)
					.then(({ body: { success, data, count } }) => {
						expect(success).toBe(true);
						expect(count).toBe(3);
						data.forEach((user: object) => {
							expect(user).toMatchObject({
								username: expect.any(String),
								requested_privacy: expect.any(String),
								created_at: expect.any(String),
								devices: expect.any(Array),
								cats: expect.any(Array),
							});
						});
					});
			});
		});

		describe('POST /api/users/', () => {
			it('201: should create a new user', () => {
				const body = {
					username: 'jeepies',
				};
				return request(app)
					.post('/api/users/')
					.send(body)
					.expect(201)
					.then(({ body: { success, data } }) => {
						expect(success).toBe(true);
						expect(data).toMatchObject({
							username: 'jeepies',
							requested_privacy: 'PUBLIC',
						});
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

		describe('POST /api/devices/update', () => {
			it('204: should return no content on successful update', () => {
				const data = {
					id: '5804f943-4aaf-432f-83d8-62028827ac57',
					lat: 42.303921,
					lon: -1.5,
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
				device_uuid: 'e062ebb6-4f14-4123-87bc-d31791756107',
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

		describe('PATCH /api/cats/update', () => {
			it('204: should return no content on successful update', () => {
				const data = {
					cat_id: 'cm3pz1t0v000308jka8bl7x25',
					name: 'Daisy, Eater of Worlds',
				};
				return request(app)
					.patch('/api/cats/update')
					.set('Authorization', 'user2')
					.send(data)
					.expect(200)
					.then(({ body: { success, data } }) => {
						expect(success).toBe(true);
						expect(data).toMatchObject({
							name: 'Daisy, Eater of Worlds',
						});
					});
			});
			it('400: should return when body has an error', () => {
				const data = {};
				return request(app)
					.patch('/api/cats/update')
					.set('Authorization', 'user1')
					.send(data)
					.expect(400);
			});
			it('401: should return when device is not authorized', () => {
				const data = {
					cat_id: 'cm3pz1t0v000308jka8bl7x25',
					name: 'Daisy, Eater of Worlds',
				};
				return request(app).patch('/api/cats/update').send(data).expect(401);
			});
		});

		describe('GET /api/cats/leaderboard/:range', () => {
			it('400: should return when passed an invalid date range', () => {
				return request(app)
					.get('/api/cats/leaderboard/INVALID')
					.expect(400)
					.then(({ body: { success, message } }) => {
						expect(success).toBe(false);
						expect(message).toBe("'invalid' is not a recognized range");
					});
			});
			describe('RANGE', () => {
				it('200: DAILY', () => {
					return request(app)
						.get('/api/cats/leaderboard/DAILY')
						.expect(200)
						.then(({ body: { success, data, range } }) => {
							expect(success).toBe(true);
							expect(range).toBe('daily');
							expect(data).toBeSorted();
							expect(data.length).toBe(2);
						});
				});
				it('200: WEEKLY', () => {
					return request(app)
						.get('/api/cats/leaderboard/WEEKLY')
						.expect(200)
						.then(({ body: { success, data, range } }) => {
							expect(success).toBe(true);
							expect(range).toBe('weekly');
							expect(data).toBeSorted();
						});
				});
				it('200: MONTHLY', () => {
					return request(app)
						.get('/api/cats/leaderboard/MONTHLY')
						.expect(200)
						.then(({ body: { success, data, range } }) => {
							expect(success).toBe(true);
							expect(range).toBe('monthly');
							expect(data).toBeSorted();
						});
				});
				it('200: YEARLY', () => {
					return request(app)
						.get('/api/cats/leaderboard/YEARLY')
						.expect(200)
						.then(({ body: { success, data, range } }) => {
							expect(success).toBe(true);
							expect(range).toBe('yearly');
							expect(data).toBeSorted();
						});
				});
				it('200: ALL_TIME', () => {
					return request(app)
						.get('/api/cats/leaderboard/all_time')
						.expect(200)
						.then(({ body: { success, data, range } }) => {
							expect(success).toBe(true);
							expect(range).toBe('all_time');
							expect(data).toBeSorted();
						});
				});
			});
		});

		describe('GET /api/cats/nearby/:id/:distance', () => {
			it('200: should return an array of cats in a circle radius of a base cat', () => {
				const daisy_id = 'cm3pz1t0v000308jka8bl7x25';
				return request(app)
					.get(`/api/cats/nearby/${daisy_id}/5`)
					.expect(200)
					.then(({ body: { success, data, radius } }) => {
						expect(success).toBe(true);
						expect(radius).toBe('5m');
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						data.forEach((match: any) => {
							expect(match.cat).not.toBeUndefined();
							expect(match.cat.id).not.toBe(daisy_id);
						});
					});
			});
			it('404: should return when a base cat is not found', () => {
				const fake_id = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
				return request(app).get(`/api/cats/nearby/${fake_id}/5`).expect(404);
			});
		});
	});
});
