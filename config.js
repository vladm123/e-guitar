var path = require('path');
var express = require('express');

// The configuration data.
exports.data = {

	// Database configuration.
	database: {
		mongodb: {
			connectionString: 'mongodb://vladmanea:vladm123@ds053978.mongolab.com:53978/e-guitar',
			collection: 'projects'
		}
	},

	// Validation configuration.
	validation: {

		// The regex for MongoDB IDs.
		idRegex: /\b[0-9A-F]{24}\b/gi,
		
		// The regex for long numbers.
		lgRegex: /^[1-9][0-9]{0,17}$/
	},
	
	// Server configuration.
	server: {
		port: 3000
	},
	
	// Security configuration (not used for now).
	security: {
		cookieParserSecret: 'Secret'
	},
	
	// Route configuration.
	route: {
		path: path.join(__dirname, 'routes')
	},
	
	// Controller configuration.
	controller: {
		path: path.join(__dirname, 'controllers')
	},
	
	// Model configuration.
	model: {
		path: path.join(__dirname, 'models')
	},

	// View configuration.
	view: {
		path: path.join(__dirname, 'views'),
		engine: 'jade'
	},
	
	// Style configuration.
	style: {
		path: path.join(__dirname, 'public'),
		engine: 'stylus'
	}
}

// The configuration function.
exports.go = function(app) {

	// Common section.
    app.set('port', process.env.PORT || exports.data.server.port);
    app.set('views', exports.data.view.path);
    app.set('view engine', exports.data.view.engine);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.cookieParser(exports.data.security.cookieParserSecret));
    app.use(express.session());
    app.use(app.router);
    app.use(require(exports.data.style.engine).middleware(exports.data.style.path));
    app.use(express.static(exports.data.style.path));

	// Development section.	
	if ('development' == app.get('env')) {
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	}

	// Production section.
	if ('development' == app.get('env')) {
		app.use(express.errorHandler());
	}
};