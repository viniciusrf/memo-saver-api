const mongoose = require('mongoose');

const memo = new mongoose.Schema({ 
    username: String, 
    title: String,
    tags: [String],
    book: String,
    bookId: String,
    data: Object }, 
{ timestamps: true });

memo.methods.project = function () {
    return {
        id: this._id,
        username: this.username,
        title: this.title,
        tags: this.tags,
        book: this.book,
        bookId: this.bookId,
        data: this.data
    };
};

module.exports = memo;