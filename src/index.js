const process = require('process');
const config = require('./config');
const package = require('./package.json');

const MongoDB = require('./mongoDB');
const HTTPServer = require('./server');

process.on('uncaughtException', err => {
	console.error('Ran to the hills on: ', err);
	process.exit(1);
}); 

process.on('unhandledRejection', err => {
	console.error('Ran to the hills on: ', err);
	process.exit(1);
}); 

(async () => {
	try {
		console.info(`Version: ${package.version}\nMode: ${process.env.NODE_ENV == 'development' ? process.env.NODE_ENV : process.env.NODE_ENV}`);
		
		const dbService = new MongoDB(config.mongoUrl);
		await dbService.connect();

		const server = new HTTPServer(dbService);
        
		server.listen(config.host, config.port);

	} catch (ex) {
		if (ex.toPrint) console.error(ex.toPrint());
		else console.error(ex);
		process.exit(1);
	}
})();
