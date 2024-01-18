const express = require('express');
const router = express.Router();
const HTTPError = require('../../../middleware/util/httpError');
const AuthorizationError = require('../../../middleware/util/authorizationError');

module.exports = (authService, memoService, tagsService) => {
	router.get('/', authService.verifyAuthentication(), async (req, res) => {
		if (!await authService.checkCredential('credential', 'memo:read')) throw new AuthorizationError(`The user '${req.credential.username}' is not authorized to read a binary`);

		const username = req.query.username;
		const title = req.query.title;
		const tags = req.query.tags;
		const book = req.query.book;
		const bookId = req.query.bookId;

		let filter = {};
		if (username) filter.username = username;
		if (title) filter.title = {$regex: title, $options: 'i'};
		if (tags) filter.tags = { $in: tags }
		if (book) filter.book = book;
		if (bookId) filter.bookId = bookId;

		const memos = await memoService.getMemos(filter);

		res.status(200).json(memos);
	});

	router.get('/:id', authService.verifyAuthentication(), async (req, res) => {
		if (!await authService.checkCredential(req.credential, 'memo:read')) throw new AuthorizationError(`The user '${req.credential.username}' is not authorized to read a binary`);

		const id = req.params.id;
		const memo = await memoService.getMemoById(id);

		res.status(200).json(memo.project());
	});

	router.post('/', authService.verifyAuthentication(), async (req, res) => {
		if (!await authService.checkCredential(req.credential, 'memo:create')) throw new AuthorizationError(`The user '${req.credential.username}' is not authorized to create a binary`);

		const title = req.body.title;
		const username = req.body.username;
		const tags = req.body.tags;
		const bookId = req.body.bookId;
		const data = req.body.data;
		 
		if (title == null || username == null) throw new HTTPError(400, 'The title and/or username parameter must be informed');

		const memo = await memoService.createMemo(title, username, tags, bookId, data);
		await tagsService.checkTags(tags);

		res.status(200).json(memo.project());
	});

	router.put('/:id', authService.verifyAuthentication(), async (req, res) => {
		if (!await authService.checkCredential(req.credential, 'memo:update')) throw new AuthorizationError(`The user '${req.credential.username}' is not authorized to update a binary`);

		const id = req.params.id;
		const title = req.body.title;
		const username = req.body.username;
		const tags = req.body.tags;
		const bookId = req.body.bookId;
		const data = req.body.data;

		if (id == null) throw new HTTPError(400, 'The id parameter must be a informed');

		const memo = await memoService.updateMemo(id, title, username, tags, bookId, data);

		res.status(200).json(memo.project());
	});

	router.delete('/:id', authService.verifyAuthentication(), async (req, res) => {
		if (!await authService.checkCredential(req.credential, 'memo:delete')) throw new AuthorizationError(`The user '${req.credential.username}' is not authorized to delete a binary`);

		const id = req.params.id;
		const memo = await memoService.deleteMemo(id);
		res.status(200).json(memo.project());
	});
    
	return router;
};