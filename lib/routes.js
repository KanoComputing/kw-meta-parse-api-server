var express = require('express');

var router = new express.Router(),
    controllers = {
        meta : require('./controller/meta')
    };

/**
 * Routes
 */
router.get('/meta', controllers.meta);

module.exports = router;