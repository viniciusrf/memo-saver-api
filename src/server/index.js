const express = require('express');
require('express-async-errors');
const router = require('./router.js');

// Middlewares
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const error = require('../middleware/error.js');

class HTTPServer {
	constructor(authService, dbService) {
		this.db = dbService;

		this.app = express();

		this.app.enable('trust proxy');
		this.app.use(compression());
		this.app.use(helmet());
		this.app.use(express.json({limit: '50mb'}));
		this.app.use(express.urlencoded({limit: '50mb', extended: true}));
		this.app.use(cookieParser());
		this.app.use(cors());
        
		this.app.use('/api/', router(authService, dbService));
        
		this.app.use(error);
	}

	listen(host, port) {
		return new Promise((resolve, reject) => {
			this.server = this.app.listen(port, host, (err) => {
				if (err) reject(err);
				console.info(`Listening http on port: ${this.server.address().port}`);
			});
		});
	}

	stop() {
		return new Promise((resolve, reject) => {
			this.server.close((err) => {
				if (err) reject(err);
				console.info('Closing http');
				resolve(this);
			});
		});
	}

	async connect() {
		await this.db.connect();
	}

	async disconnect() {
		await this.db.disconnect();
	}
    
}

module.exports = HTTPServer;