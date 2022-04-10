import {Request, Response, NextFunction} from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = require('express').Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const allUsers = await prisma.users.findMany()
		res.json(allUsers);
	} catch (error) {
		next(error)
	}
});

module.exports = router;
