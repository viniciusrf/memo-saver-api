const HTTPError = require('../../../middleware/util/httpError');
const ObjectId = require('mongoose').Types.ObjectId;

class Memo {

	constructor(DB){
		this.db = DB;
	}

	async getMemos(filter = {}) {
		return this.db.Memo.find(filter).exec();
	}

	async getMemoById(id) {
		if (typeof (id) != 'string') throw new TypeError('The id argument must be a string of 12 bytes or a string of 24 hex characters');

		const memo = (await this.db.Memo.findOne({_id: new ObjectId(id)}).exec());

		if (!memo) throw new HTTPError(404, 'Memo not found');

		return memo;
	}

	async createMemo(title, username, tags, bookId, data) {
		if (typeof (title) != 'string') throw new TypeError('The title argument must be a string');
		if (typeof (username) != 'string') throw new TypeError('The username argument must be a string');
		if (typeof (tags) != 'object') throw new TypeError('The tags argument must be a array of strings');
		if (typeof (bookId) != 'string') throw new TypeError('The bookId argument must be a string');
		if (typeof (data) != 'object') throw new TypeError('The data argument must be a object');

		const bookItem = (await this.db.Book.findOne({_id: new ObjectId(bookId)}).exec());
		if (!bookItem) throw new HTTPError(404, 'Book selected not found');
		const book = bookItem.title

		const memo = await this.db.Memo({title, username, tags, book, bookId, data}).save();

		return memo;
	}

	async updateMemo(id, title, username, tags, book, bookId, data) {
		if (typeof (id) != 'string') throw new TypeError('The id argument must be a string of 12 bytes or a string of 24 hex characters');
		
		const memo = (await this.db.Memo.findOne({_id: new ObjectId(id)}).exec());
		if (!memo) throw new HTTPError(404, 'Memo not found');

		if (title) memo.title = title;
		if (username) memo.username = username;
		if (tags) memo.tags = tags;
		if (bookId) {
			memo.bookId = bookId;
			const bookItem = (await this.db.Book.findOne({_id: new ObjectId(bookId)}).exec());
			if (!bookItem) throw new HTTPError(404, 'Book selected not found');
			memo.book = bookItem.title;
		}
		if (data) memo.data = data;

		return memo.save();
	}

	async deleteMemo(id) {
		if (typeof (id) != 'string') throw new TypeError('The id argument must be a string of 12 bytes or a string of 24 hex characters');

		const memo = (await this.db.Memo.findOne({_id: new ObjectId(id)}).exec());
		if (!memo) throw new HTTPError(404, 'Resource not found');

		return await memo.delete();
	}
}

module.exports = Memo;