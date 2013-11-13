var expect = require('expect.js');
var should = require('should');
var http = require('http');
var app = require('./app');

var test = {
	host: 'localhost',
	port: 3000
};

// To run the tests, 
describe('Suite one', function() {
	before(function(done) {
		require('./models/projects').init('projects-test', 'mongodb://vladmanea:vladm123@ds053978.mongolab.com:53978/e-guitar');
		require('./models/tasks').init('projects-test', 'mongodb://vladmanea:vladm123@ds053978.mongolab.com:53978/e-guitar');
		done();
	});

	it('Listens at the test host and port.', function(done) {
		http.get({hostname:test.host, port:test.port, path:'/'}, function(res) {
			res.statusCode.should.eql(200);
			done();
		});
	});
	
	it('', function(done) {
		
	});
});