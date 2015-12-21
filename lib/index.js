
var app = require('../index.js')('meta'), 
    server;

server = app.listen(process.env.PORT || 2000, listen);

/**
 * Server listen callback
 */
function listen() {
    console.log('Listening on http://localhost:' + server.address().port + '...');
}