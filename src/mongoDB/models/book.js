const mongoose = require('mongoose');

const book = new mongoose.Schema({ 
    title: String,
    username: String, 
 }, 
{ timestamps: true });

book.methods.project = function () {
    return {
        id: this._id,
        title: this.title,
        username: this.username
    };
};

module.exports = book;