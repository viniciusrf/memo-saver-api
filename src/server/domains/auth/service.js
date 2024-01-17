const RBAC = require('easy-rbac');
const HTTPError = require('../../../middleware/util/httpError');
const AuthenticationError = require('../../../middleware/util/authenticationError');

const ROLES_POLICY = {
	user: {
		can: [
			'user:check',
			'books:*'
		]
	},
	superuser: {
		can: [
			'users:*',
			'books:*'
		]
	}
};

class Auth {
	constructor(DB, config) {
		this.db = DB;
		this.config = config;
		this.rbac = new RBAC(ROLES_POLICY);
	}

    async checkCredential(credential, role, params) {
        return true
		// return this.rbac.can(credential.roles, role, params);
	}

	verifyAuthentication(required = true) {
		return async (req, res, next) => {

			try {
				
			} catch (ex) {
				next(ex);
				return;
			}

			next();
		};
	}

}

module.exports = Auth;