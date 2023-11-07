const HTTPError = require('./util/httpError');
const AuthorizationError = require('./util/authorizationError');
const AuthenticationError = require('./util/authenticationError');

module.exports = (err, req, res, next) => {  // eslint-disable-line no-unused-vars
	// Treat authentication errors as a forbidden
	if (err instanceof AuthenticationError)
		err = new HTTPError(401, err.message, err, null);

	// Treat authorization errors as a forbidden
	else if (err instanceof AuthorizationError)
		err = new HTTPError(403, err.message, err, null);
	// Treat all other errors as internal server error
	else if (!(err instanceof HTTPError)) {
		if (err.status) err = new HTTPError(err.status, err.message, err, null);
		else if (err.statusCode) err = new HTTPError(err.statusCode, err.message, err, null);
		else err = new HTTPError(500, err.message, err, null);
	}

	res.status(err.status);
	if (process.env.NODE_ENV !== 'test') console.error(err.toPrint()); // Caso queira forçar a visualização dos erros, comente o IF

	if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test') res.json(err);
	else res.json({ status: err.status, message: err.message });
};