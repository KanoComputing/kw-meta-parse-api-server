var express = require('express'),
	router,
    controllers = {
        meta : require('./controller/meta')
    };

/**
 * Routes
 */

module.exports = function (root) {
	var router = new express.Router();
	root = root || '';
	router.get('/' + root, controllers.meta);
	return router;
};