const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
require('dotenv').config();
const expressJWT = require('express-jwt');
const jwksClient = require('jwks-rsa');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(morgan('dev'));

app.use(expressJWT({
	secret: jwksClient.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: `http://localhost:4000/.well-known/jwks.json`
	}),
	algorithms: ['RS256'],
}).unless({path: ['/']}));

app.get('/', async (req, res, next) => {
	res.send({message: 'this is resource api server'});
});

app.get('/protected', async (req, res, next) => {
	res.send({message: 'this is protected resource api server'});
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
