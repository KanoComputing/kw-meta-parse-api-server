var express = require('express'),
    routes = require('./routes');

var app = express(),
    server = app.listen(process.env.PORT || 2000, listen);

app.use('/', routes);

/**
 * Server listen callback
 */
function listen() {
    console.log('Listening on http://localhost:' + server.address().port + '...');
}