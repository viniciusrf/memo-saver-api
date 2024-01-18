const express = require('express');
const router = express.Router();
const HTTPError = require('../../../middleware/util/httpError');
const AuthorizationError = require('../../../middleware/util/authorizationError');

module.exports = (authService, tagsService) => {
	router.get('/', authService.verifyAuthentication(), async (req, res) => {
		if (!await authService.checkCredential('credential', 'tags:read')) throw new AuthorizationError(`The user '${req.credential.username}' is not authorized to read a binary`);

		const usedWith = req.query.usedWith;

		let filter = {};
		if (usedWith) filter.usedWith.usually = { $in: usedWith }

		const tags = await tagsService.getTags(filter);

		res.status(200).json(tags);
	});

	router.get('/:id', authService.verifyAuthentication(), async (req, res) => {
		if (!await authService.checkCredential(req.credential, 'tags:read')) throw new AuthorizationError(`The user '${req.credential.username}' is not authorized to read a binary`);

		const id = req.params.id;
		const tag = await tagsService.getTagsById(id);

		res.status(200).json(tag.project());
	});

	router.post('/', authService.verifyAuthentication(), async (req, res) => {
		if (!await authService.checkCredential(req.credential, 'tags:create')) throw new AuthorizationError(`The user '${req.credential.username}' is not authorized to create a binary`);

		const tagName = req.body.tagName;
		const usage = req.body.usage;
		const major = req.body.major;
		const usually = req.body.usually;

		const usedWith = {
			'major': major,
			'usually': usually
		}
		 
		const tag = await tagsService.createTag(tagName, usage, usedWith);

		res.status(200).json(tag.project());
	});

	return router;
};