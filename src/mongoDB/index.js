const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const User = require('./models/user');
const Book = require('./models/book');
const Memo = require('./models/memo');

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