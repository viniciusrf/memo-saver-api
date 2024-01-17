const express = require('express');

// Routers
const booksRouter = require('./domains/book/route');

// Internal Services
const Book = require('./domains/book/service');


const createMainRouter = (authService, dbService) => {
	const router = express.Router();

	const bookService = new Book(dbService);

	router.get('/', (req, res) => {
		res.send({status: true});
	});

	router.get('/ping', (req, res) => {
		res.send({pong: true});
	});

	router.use('/books', booksRouter(authService, bookService));

	return router;
};

module.exports = createMainRouter;
