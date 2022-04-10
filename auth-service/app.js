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

app.get('/login', async (req, res, next) => {
	// Assuming done all the login checks

	// Read file
	const secret = fs.readFileSync('./certs/private.pem');

	// Generate a token
	JWT.sign({}, secret, {
		expiresIn: '10min',
		algorithm: 'RS256'
	}, (err, token) => {
		if (err) {
			return next(createError(500, err));
		}
		return res.send({
			token
		});
	});
});

app.use('/api', require('./routes/api.route'));

app.use((req, res, next) => {
	next(createError.NotFound());
});

app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.send({
		status: err.status || 500,
		message: err.message,
	});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
