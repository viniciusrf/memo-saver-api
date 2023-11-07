const ExtendedError = require('./extendedError');

class AuthorizationError extends ExtendedError {
	constructor(...args) {
		super(...args);
	}
}

module.exports = AuthorizationError;