const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const User = require('./models/user');
const Book = require('./models/book');
const Memo = require('./models/memo');
const Tags = require('./models/tags');

class MongoDB {
    constructor(mongoURL) {
        this.mongoURL = mongoURL;
    }

    async connect() {
        let options = {
        };
        
        try {
            this.connection = (await mongoose.connect(this.mongoURL, options)).connection;
            this.User = await this.connection.model('User', User);
            this.Book = await this.connection.model('Book', Book);
            this.Memo = await this.connection.model('Memo', Memo);
            this.Tags = await this.connection.model('Tags', Tags);
            
        } catch (error) {
            throw new Error(error);
        }
        return;
    }

    async disconnect() {
        return await this.connection.close();
    }

    isHealthy() {
        return this.connection.readyState == 1;
    }
}

module.exports = MongoDB;