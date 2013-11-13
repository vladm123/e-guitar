var express = require('express');
var config = require('./config');
var routes = require('./routes');
var http = require('http');
var app = express();

// Start function.
exports.start = function(next) {

	// Configure the app.
	app.configure(function() { config.go(app); });

	// Particular routes.
	routes.setup(app);

	// Start the server.
	http.createServer(app).listen(app.get('port'), next);
}