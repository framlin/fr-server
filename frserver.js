var union = require('union'),
    director = require('director'),
    flatiron = require('flatiron');


function SiteServer() {
    var ecstatic = require('ecstatic'),
        webserver = new flatiron.App(),
        router = new director.http.Router();

    function RESTDispatcher(req, res) {
        if (!router.dispatch(req, res)) {
            res.emit('next');
        }
    }

    this.getRouter = function getRouter() {
        return router;
    };

    this.getWebserver = function getWebserver() {
        return webserver;
    };

    this.start = function start(rootPath, siteName, siteRouting, siteBuilder) {
        var serverPort = require('fr-infra').ServerConfig[siteName].port;

        webserver.use(flatiron.plugins.http);
        webserver.http.before = [
            RESTDispatcher,
            ecstatic(rootPath)
        ];

        siteRouting.configure(siteName, router, siteBuilder, function cbConfigured() {
            webserver.start(serverPort);
        });
    };

}



module.exports = new SiteServer();
