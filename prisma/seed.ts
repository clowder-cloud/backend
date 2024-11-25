import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seeder() {
	const user1 = await prisma.user.upsert({
		where: { username: 'user1' },
		update: {},
		create: {
			id: 'cm3op7iwu0000jrcqa60tc9kv',
			username: 'user1',
		},
	});

	await prisma.user.upsert({
		where: { username: 'user2' },
		update: {},
		create: {
			id: 'cm3op7iww0001jrcqpq3qxx6i',
			username: 'user2',
		},
	});

	const device1 = await prisma.device.upsert({
		where: { uuid: '5804f943-4aaf-432f-83d8-62028827ac57' },
		update: {},
		create: {
			name: 'Tiddles Collar',
			owner_id: user1.id,
			uuid: '5804f943-4aaf-432f-83d8-62028827ac57',
			last_pulse_at: '2024-11-25T16:22:11.108Z',
			last_location: { lon: -1.445, lat: 53.8075 },
			location_history: [
				{ lon: -1.446, lat: 53.807, timestamp: '2024-11-25T16:15:11.108Z' },
				{ lon: -1.447, lat: 53.8065, timestamp: '2024-11-25T16:08:11.108Z' },
				{ lon: -1.4485, lat: 53.806, timestamp: '2024-11-25T16:01:11.108Z' },
				{ lon: -1.4495, lat: 53.8055, timestamp: '2024-11-25T15:54:11.108Z' },
			],
		},
	});

	const device2 = await prisma.device.upsert({
		where: { uuid: '36932d18-78a2-4ceb-b979-64a5ed441551' },
		update: {},
		create: {
			name: 'A Collar',
			owner_id: user1.id,
			uuid: '36932d18-78a2-4ceb-b979-64a5ed441551',
			last_pulse_at: '2024-11-25T16:22:11.108Z',
			last_location: { lon: -1.447, lat: 53.8035 },
			location_history: [
				{ lon: -1.4485, lat: 53.804, timestamp: '2024-11-25T16:15:11.108Z' },
				{ lon: -1.449, lat: 53.8045, timestamp: '2024-11-25T16:08:11.108Z' },
				{ lon: -1.45, lat: 53.805, timestamp: '2024-11-25T16:01:11.108Z' },
				{
					lon: -1.451106,
					lat: 53.806201,
					timestamp: '2024-11-25T15:54:11.108Z',
				},
			],
		},
	});

	await prisma.device.upsert({
		where: { uuid: 'e062ebb6-4f14-4123-87bc-d31791756107' },
		update: {},
		create: {
			name: 'A Collar',
			owner_id: user1.id,
			uuid: 'e062ebb6-4f14-4123-87bc-d31791756107',
		},
	});

	await prisma.cat.upsert({
		where: { id: 'cm3pr1rkb000008l8fs7icr9g' },
		update: {},
		create: {
			id: 'cm3pr1rkb000008l8fs7icr9g',
			name: 'Mr Tiddles',
			picture_url:
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWGpMwXI5hOZhVNL9Z1YZfhSgjjY1qEBRJgQ&s',
			owner_id: user1.id,
			device_id: device1.id,
		},
	});

	await prisma.cat.upsert({
		where: { id: 'cm3pz1t0v000308jka8bl7x25' },
		update: {},
		create: {
			id: 'cm3pz1t0v000308jka8bl7x25',
			name: 'Daisy, Destroy of Life',
			picture_url:
				'https://c8.alamy.com/comp/DBTJAD/a-closeup-picture-of-a-cats-face-on-a-white-background-DBTJAD.jpg',
			owner_id: user1.id,
			device_id: device2.id,
		},
	});
}

if (require.main === module) {
	seeder()
		.then(async () => await prisma.$disconnect)
		.catch(async (e) => {
			console.error(e);
			await prisma.$disconnect();
			process.exit(1);
		});
}

export default seeder;
