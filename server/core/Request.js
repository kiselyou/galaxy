var path = require('path');
var fs = require('fs');

var IW = IW || {};

/**
 *
 * @param {{}} config
 * @constructor
 */
IW.Request = function (config) {

    this.config = config;
    this.DIR_APP = getEnvironment(config);
    this.PATH_APP = __dirname + '/../../' + this.DIR_APP;
    this.PATH_TEMPLATES = this.PATH_APP + IW.Request.DIR_TEMPLATES;
    this.PATH_ROUTES = __dirname + IW.Request.DIR_ROUTES;
    this._loadRoutes();

    /**
     * Get directory of environment
     *
     * @param {{environment: {app: boolean, dist: boolean}}} config
     * @returns {string} possible values ( 'app' | 'dist' )
     */
    function getEnvironment(config) {
        for (var environment in config.environment) {
            if (config.environment.hasOwnProperty(environment) && config.environment[environment]) {
                return environment;
            }
        }
        return IW.Request.ENVIRONMENT_PROD;
    }
};

/**
 * It is configuration from file ("server/config/config.json" - by default)
 *
 * @type {{}|{encoding: string, environment: { app: boolean, dist: boolean }, server: { port: number, host: string}, socket: { port: number, host: string}, routes: { templates: string } }}
 */
IW.Request.prototype.config = {};

/**
 *
 * @returns {boolean}
 */
IW.Request.prototype.isDev = function () {
    return this.DIR_APP === IW.Request.ENVIRONMENT_DEV;
};

/**
 *
 * @returns {boolean}
 */
IW.Request.prototype.isProd = function () {
    return this.DIR_APP === IW.Request.ENVIRONMENT_PROD;
};

/**
 *
 * @type {Array}
 */
IW.Request.prototype.routes = [];

/**
 * This method are uploading file of routes configuration and put them to property "<IW.Request.routes>"
 *
 * @returns {void}
 * @private
 */
IW.Request.prototype._loadRoutes = function () {
    try {

        var filedRoute = fs.readdirSync(this.PATH_ROUTES);

        for ( var r = 0; r < filedRoute.length; r++ ) {
            var path = this.joinPath(this.PATH_ROUTES, filedRoute[ r ]);
            var data = require(path);
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    data[key]['name'] = key;
                    this.routes.push(data[key]);
                }
            }
        }

    } catch (error) {
        console.log('Can not load routes', error);
    }
};

/**
 * @returns {Array}
 */
IW.Request.prototype.getRoutes = function () {
    return this.routes;
};

/**
 *
 * @param {string} dir - possible value ( '/var/www/project/' | '/var/www/project/' )
 * @param {string} str - possible value ( '/path/to/file' )
 * @returns {string}
 */
IW.Request.prototype.joinPath = function (dir, str) {
    return path.join(dir, str);
};

IW.Request.ENVIRONMENT_PROD = 'dist';
IW.Request.ENVIRONMENT_DEV = 'app';

IW.Request.DIR_TEMPLATES = '/view';
IW.Request.DIR_ROUTES = '/../routing';

module.exports = IW;
