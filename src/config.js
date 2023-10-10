const config = {
	host : process.env.HOST || 'localhost',
	port : process.env.PORT || process.env.HTTP_PORT || 8080,
	mongoUrl : (process.env.MONGO_URL || 'mongodb://localhost/memo-saver'),
	modeEnv : (process.env.NODE_ENV || 'development')
};

module.exports = config;
