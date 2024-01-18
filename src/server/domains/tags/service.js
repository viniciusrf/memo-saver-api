const HTTPError = require('../../../middleware/util/httpError');
const ObjectId = require('mongoose').Types.ObjectId;

class Tags {

	constructor(DB){
		this.db = DB;
	}

	async getTags(filter = {}) {
		return this.db.Tags.find(filter).exec();
	}

	async getTagsById(id) {
		if (typeof (id) != 'string') throw new TypeError('The id argument must be a string of 12 bytes or a string of 24 hex characters');

		const tag = (await this.db.Tags.findOne({_id: new ObjectId(id)}).exec());

		if (!tag) throw new HTTPError(404, 'Tag not found');

		return tag;
	}

	async createTag(tagName, usage, usedWith) {
		if (typeof (tagName) != 'string') throw new TypeError('The tagName argument must be a string');
		if (typeof (usage) != 'number') throw new TypeError('The usage argument must be a number');
		if (typeof (usedWith) != 'object') throw new TypeError('The usedWith argument must be a object');

		const tag = await this.db.Tags({tagName, usage, usedWith}).save();

		return tag;
	}

	async checkTags(tags) {
		// const usage = 1;
		for (const tag of tags) {
			const tagFound = (await this.db.Tags.findOne({tagName: tag}).exec());
			if (!tagFound) {
				await this.db.Tags({tagName: tag, usage: 1, usedWith: tags}).save();
			} else {
				tagFound.usage = tagFound.usage + 1;
				await tagFound.save();
			}
		}
	}

}

module.exports = Tags;