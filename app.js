var express = require('express');
var config = require('./config');
var routes = require('./routes');
var http = require('http');

// Start function.
exports.start = function() {
	var app = express();

	// Configure the app.
	app.configure(function() { config.go(app); });

	// Particular routes.
	routes.setup(app);

	// Start the server.
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});
}