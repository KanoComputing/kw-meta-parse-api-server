var express = require('express'),
    routes = require('./routes'),
    cors = require('cors');

var app = express(),
    server = app.listen(process.env.PORT || 2000, listen);

// Enable CORS
app.use(cors());

// Instanciate routes
app.use('/', routes);

/**
 * Server listen callback
 */
function listen() {
    console.log('Listening on http://localhost:' + server.address().port + '...');
}