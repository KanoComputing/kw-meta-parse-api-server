var express = require('express'),
    cors = require('cors');



/**
 * Root expresses the additional rout where the routes need to be mounted and it's optional
 * @param  {string} root A route
 * @return {object}      an Express app
 */
module.exports = function (root) {
    var app = express(),
        routes = require('./lib/routes')(root);

    // Enable CORS
    app.use(cors());

    // Instanciate routes
    app.use('/', routes);
    return app;
}