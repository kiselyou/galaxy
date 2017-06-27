
const passwordHash = require('password-hash');
const KEY_SESSION = 'security';

class Authorization {

    constructor() {
        this._roundsSalt = 10;
    }

    static getSessionData(req, value) {
        if (req.session) {
            return req.session.hasOwnProperty(KEY_SESSION) ? req.session[KEY_SESSION][value] : null;
        }
        return null;
    }

    /**
     *
     * @param {{}} req
     * @param {{}} user
     * @param {string} userRole
     * @returns void
     */
    createSessionUser(req, user, userRole) {
        req.session[KEY_SESSION] = {user: user, role: userRole};
    };

    /**
     *
     * @param req
     * @returns {{}|null}
     */
    getSessionUser(req) {
        return Authorization.getSessionData(req, 'user');
    };

    /**
     *
     * @param req
     * @returns {{}|null}
     */
    getSessionRole(req) {
        return Authorization.getSessionData(req, 'role');
    }

    /**
     *
     * @param req
     * @returns void
     */
    destroySessionUser(req) {
        req.session.destroy();
    };

    /**
     *
     * @param {string} password
     * @returns {string}
     */
    hashPassword(password) {
        return passwordHash.generate(password);
    };

    /**
     *
     * @param {string} password
     * @param {string} hashedPassword
     * @returns {void}
     */
    comparePassword(password, hashedPassword) {
        return passwordHash.verify(password, hashedPassword);
    }
}

/**
 *
 * @module Authorization
 */
module.exports = Authorization;
