const mongoose = require('mongoose');

const tags = new mongoose.Schema({ 
    tagName: String,
    usage: Number, 
    usedWith: Object
 }, 
{ timestamps: true });

tags.methods.project = function () {
    return {
        id: this._id,
        tagName: this.tagName,
        usage: this.usage,
        usedWith: this.usedWith
    };
};

module.exports = tags;