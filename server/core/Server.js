const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const multiparty = require('multiparty');
const app = express();

const Error = require('./Error');
const Components = require('./Components');
const Socket = require('./Socket.js');

class Server extends Components {

    constructor() {
        super();
        this.db.open();

        this._socket = new Socket(app, this);
    }

    /**
     *
     * @returns {Server}
     */
    routeControls() {
        this.routes.load((routes) => {
            app.use('/app/', express.static(this.routes.joinPath(__dirname, '/../../' + this.conf.pathEnvironment)));
            for (let route of routes) {
                this.createRoute(route);
            }
            app.get('*', (req, res) => {
                new Error(null).warning('The page "' + req.url + '" was not found.', 'Server', 'routeControls');
                this.response(req, res, this.view.loadError(true));
            });
        });

        return this;
    }

    /**
     *
     * @param {{method: string, route: string, viewPath: string}} params
     * @returns {Server}
     */
    createRoute(params) {
        switch (params['method']) {
            case 'POST':
                app.post(params['route'], (req, res) => {

                    var form = new multiparty.Form();
                    form.parse(req, (err, fields, files) => {
                        if (err) {
                            new Error(null).warning('Multipart form data error.', 'Server', 'createRoute:POST');
                        }
                        req['fields'] = fields;
                        req['files'] = files;
                        this.sendResponse(req, res, params);
                    });
                });
                break;
            case 'GET':
                app.get(params['route'], (req, res) => {
                    this.sendResponse(req, res, params);
                });
                break;
            case 'SOCKET':
                this._socket.listen(params['route']);
                break;
            default:
                app.all(params['route'], (req, res) => {
                    this.sendResponse(req, res, params);
                });
                break;
        }
        return this;
    };

    /**
     *
     * @param req
     * @param res
     * @param {{method: string, route: string, viewPath: string}} params
     * @returns {Server}
     */
    sendResponse(req, res, params) {
        if (this.secur.isGranted(req.url, this.secur.getSessionRole(req))) {
            if (params.hasOwnProperty('viewPath')) {
                let page =  this.view.load(params['route'], params['viewPath'], true);
                this.response(req, res, page);
            } else {
                this.callToController(req, res, params);
                return this;
            }
        } else {

            new Error(null).permission('Permission Denied. Page: "' + req.url + '".', 'Server', 'sendResponse');
            this.response(req, res, this.view.loadError(true));
        }
        return this;
    };

    /**
     * Call to controller
     *
     * @param {{}} req
     * @param {{}} res
     * @param {{method: string, route: string, viewPath: string, controller: string}} params
     * @returns {Server}
     */
    callToController(req, res, params) {
        // 0 - module, 1 - name of controller 2 - method
        let data = params['controller'].split(':');

        if (data.length !== 3) {
            res.writeHead(200, this.conf.contentType(2));
            res.end(
                new Error(null)
                    .warning('Route configuration is not correct', 'Server', 'callToController')
                    .get()
            );
            return this;
        }

        let method = data[2];
        let file = data[0] + '/' + data[1] + '.js';
        let path = this.routes.joinPath(this.routes.joinPath(__dirname, '/../../' + this.conf.pathController), file);

        try {
            let Controller = require(path);
            let object = new Controller(this, this.db.connection);
            object[method](req, res, params);

        } catch (e) {
            res.writeHead(200, this.conf.contentType(2));
            res.end(
                new Error(e)
                    .alert('Route - "' + file + '". Method - "' + method + '".', 'Server', 'callToController')
                    .get()
            );
        }
        return this;
    };

    /**
     *
     * Send response to client
     *
     * @param {{}} req
     * @param {{}} res
     * @param {string} str
     * @returns {Server}
     */
    response(req, res, str) {
        res.writeHead(200, this.conf.contentType());
        res.end(str, this.conf.encoding, true);
        return this;
    };

    /**
     *
     * @returns {Server}
     */
    init() {

        app.use(session({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: true
        }));

        app.use(bodyParser.urlencoded({ extended: true }));
        // app.use(formidable());
        app.use(bodyParser.json());
        this.routeControls();
        app.listen(this.conf.server.port, this.conf.server.host);
        return this;
    }
}

module.exports = Server;
