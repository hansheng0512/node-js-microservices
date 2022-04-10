import { PrismaClient } from '@prisma/client';
import {UsersSeed} from "./data/users";

const prisma = new PrismaClient();

async function main() {
	console.log('Seeding users');
	UsersSeed.map(async (userDetails, index) => {
		await prisma.users.create({
			data: {
				email: userDetails.email,
				password: userDetails.password,
			},
		});
	});
	console.log('Seeded users');
}

main()
	.catch((err) => {
		console.error(err);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
