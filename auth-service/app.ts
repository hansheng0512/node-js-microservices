import {NextFunction, Request, Response} from "express";

const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
require('dotenv').config();
const JWT = require('jsonwebtoken');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(express.static('public'));

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
	res.send({message: 'this is auth api server'});
});

app.get('/login', async (req: Request, res: Response, next: NextFunction)=> {
	// Assuming done all the login checks

	// Read file
	const secret = fs.readFileSync('./certs/private.pem');

	// Generate access token
	const accessToken = JWT.sign({}, secret, {
		expiresIn: '10min',
		algorithm: 'RS256'
	}, (err: string, token: string) => {
		if (err) {
			return next(createError(500, err));
		}
		return token
	});

	// Generate refresh token
	const refreshToken = JWT.sign({}, secret, {
		expiresIn: '2h',
		algorithm: 'RS256'
	}, (err: string, token: string) => {
		if (err) {
			return next(createError(500, err));
		}
		return token
	});

	res.json({
		accessToken,
		refreshToken
	});

});

app.use('/api/v1/users', require('./routes/api/v1/users.route'));

app.use((req: Request, res: Response, next: NextFunction) => {
	next(createError.NotFound());
});

app.use((err: { status: number; message: string; }, req: Request, res: Response, next: NextFunction) => {
	res.status(err.status || 500);
	res.send({
		status: err.status || 500,
		message: err.message,
	});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
