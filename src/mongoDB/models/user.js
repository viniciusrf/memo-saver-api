const mongoose = require('mongoose');

const user = new mongoose.Schema({ 
    username: String, 
    password: String }, 
{ timestamps: true });
user.index({ username: 1 }, { unique: true });

user.methods.project = function () {
    return {
        id: this._id,
        username: this.username
    };
};

module.exports = user;