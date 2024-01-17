const HTTPError = require('../../../middleware/util/httpError');
const ObjectId = require('mongoose').Types.ObjectId;

class Book {

	constructor(DB){
		this.db = DB;
	}

	async getBooks(filter = {}) {
		return this.db.Book.find(filter).exec();
	}

	async getBookById(id) {
		if (typeof (id) != 'string') throw new TypeError('The id argument must be a string of 12 bytes or a string of 24 hex characters');

		const book = (await this.db.Book.findOne({_id: new ObjectId(id)}).exec());

		if (!book) throw new HTTPError(404, 'Book not found');

		return book;
	}

	async createBook(title, username) {
		if (typeof (title) != 'string') throw new TypeError('The title argument must be a string');
		if (typeof (username) != 'string') throw new TypeError('The username argument must be a string');
		
		const book = await this.db.Book({title, username}).save();

		return book;
	}

	async updateBook(id, title, username) {
		if (typeof (id) != 'string') throw new TypeError('The id argument must be a string of 12 bytes or a string of 24 hex characters');
		
		const book = (await this.db.Book.findOne({_id: new ObjectId(id)}).exec());
		if (!book) throw new HTTPError(404, 'Book not found');

		if (title) book.title = title;
		if (username) book.username = username;

		return book.save();
	}

	async deleteBook(id) {
		if (typeof (id) != 'string') throw new TypeError('The id argument must be a string of 12 bytes or a string of 24 hex characters');

		const book = (await this.db.Book.findOne({_id: new ObjectId(id)}).exec());
		if (!book) throw new HTTPError(404, 'Resource not found');

		return await book.delete();
	}
}

module.exports = Book;