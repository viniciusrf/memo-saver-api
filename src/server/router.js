const express = require('express');

// Routers
const booksRouter = require('./domains/book/route');
const memoRouter = require('./domains/memo/route');
const tagsRouter = require('./domains/tags/route')

// Internal Services
const Book = require('./domains/book/service');
const Memo = require('./domains/memo/service');
const Tags = require('./domains/tags/service');


const createMainRouter = (authService, dbService) => {
	const router = express.Router();

	const bookService = new Book(dbService);
	const memoService = new Memo(dbService);
	const tagsService = new Tags(dbService);

	router.get('/', (req, res) => {
		res.send({status: true});
	});

	router.get('/ping', (req, res) => {
		res.send({pong: true});
	});

	router.use('/books', booksRouter(authService, bookService));
	router.use('/tags', tagsRouter(authService, tagsService))
	router.use('/memo', memoRouter(authService, memoService, tagsService));

	return router;
};

module.exports = createMainRouter;
