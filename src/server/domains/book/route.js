const express = require('express');
const router = express.Router();
const HTTPError = require('../../../middleware/util/httpError');
const AuthorizationError = require('../../../middleware/util/authorizationError');

module.exports = (authService, bookService) => {
	router.get('/', authService.verifyAuthentication(), async (req, res) => {
		if (!await authService.checkCredential('credential', 'books:read')) throw new AuthorizationError(`The user '${req.credential.username}' is not authorized to read a binary`);

		const username = req.query.username;
		const title = req.query.title;

		let filter = {};
		if (username) filter.username = username;
		if (title) filter.title = {$regex: title, $options: 'i'};

		const books = await bookService.getBooks(filter);

		res.status(200).json(books);
	});

	router.get('/:id', authService.verifyAuthentication(), async (req, res) => {
		if (!await authService.checkCredential(req.credential, 'books:read')) throw new AuthorizationError(`The user '${req.credential.username}' is not authorized to read a binary`);

		const id = req.params.id;
		const book = await bookService.getBookById(id);

		res.status(200).json(book.project());
	});

	router.post('/', authService.verifyAuthentication(), async (req, res) => {
		if (!await authService.checkCredential(req.credential, 'books:create')) throw new AuthorizationError(`The user '${req.credential.username}' is not authorized to create a binary`);

		const title = req.body.title;
		const username = req.body.username;
		 
		if (title == null || username == null) throw new HTTPError(400, 'The title and/or username parameter must be informed');

		const book = await bookService.createBook(title, username);

		res.status(200).json(book.project());
	});

	router.put('/:id', authService.verifyAuthentication(), async (req, res) => {
		if (!await authService.checkCredential(req.credential, 'books:update')) throw new AuthorizationError(`The user '${req.credential.username}' is not authorized to update a binary`);

		const id = req.params.id;
		const title = req.body.title;
		const username = req.body.username;

		if (id == null) throw new HTTPError(400, 'The id parameter must be a informed');

		const book = await bookService.updateBook(id, title, username);

		res.status(200).json(book.project());
	});

	router.delete('/:id', authService.verifyAuthentication(), async (req, res) => {
		if (!await authService.checkCredential(req.credential, 'books:delete')) throw new AuthorizationError(`The user '${req.credential.username}' is not authorized to delete a binary`);

		const id = req.params.id;
		const book = await bookService.deleteBook(id);
		res.status(200).json(book.project());
	});
    
	return router;
};