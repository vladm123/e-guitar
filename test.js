var expect = require('expect.js');
var should = require('should');
var http = require('http');
var app = require('./app');
var mongo = require('mongodb');
var client = mongo.MongoClient;

// To run the tests, the server must be running here
var test = {
	host: 'localhost',
	port: 3000
};

// Timeout set.
var maximumRuntime = 30000;

// To run the tests, they have to connect to this string
var connectionString = 'mongodb://vladmanea:vladm123@ds053978.mongolab.com:53978/e-guitar';
var collectionName = 'projects';

describe('Server is alive', function() {
	before(function(done) {
		require('./models/projects').init(collectionName, connectionString);
		require('./models/tasks').init(collectionName, connectionString);
		done();
	});

	it('Listens at the test host and port', function(done) {
		this.timeout(maximumRuntime);
		http.get({hostname:test.host, port:test.port, path:'/'}, function(result) {
			result.statusCode.should.eql(200);
			done();
		});
	});
});

describe('Project select all', function() {
	before(function(done) {
		client.connect(connectionString, function(error, database) {
			if (error) {
				true.should.be.false;
			}
			
			// Remove all projects
			database.collection(collectionName) 
				.remove(function(error, removed) {
					if (error) {
						true.should.be.false;
					}
				
					// Add two projects
					database.collection(collectionName)
						.insert([
								{'name':'P1', 'description':'D1'},
								{'name':'P2'}
							],
							function(error, result) {
								if (error) {
									true.should.be.false;
								}
								
								done();
							});
				});
		});
	});

	// Select all projects
	it('Selects all projects', function(done) {
		this.timeout(maximumRuntime);
		client.connect(connectionString, function(error, database) {
			if (error) {
				true.should.be.false;
			}
			
			http.get({hostname:test.host, port:test.port, path:'/projects'}, function(result) {
				result.statusCode.should.eql(200);
				var responseParts = [];
				result.setEncoding('utf8');
				result.on("data", function(chunk) {
					responseParts.push(chunk);
				});
				result.on("end", function(){
					var results = JSON.parse(responseParts.join(''));
					
					results.length.should.eql(2);
					
					results[0].name.should.eql('P2');
					expect(results[0].description).to.be.undefined;
					
					results[1].name.should.eql('P1');
					results[1].description.should.eql('D1');
					
					done();
				});
			});
		});
	});
	
	// Select specific project
	it('Selects specific project', function(done) {
		this.timeout(maximumRuntime);
		client.connect(connectionString, function(error, database) {
			if (error) {
				true.should.be.false;
			}
			
			http.get({hostname:test.host, port:test.port, path:'/projects'}, function(result) {
				result.statusCode.should.eql(200);
				var responseParts = [];
				result.setEncoding('utf8');
				result.on("data", function(chunk) {
					responseParts.push(chunk);
				});
				result.on("end", function(){
					var results = JSON.parse(responseParts.join(''));
					var id = results[0]._id;
					http.get({hostname:test.host, port:test.port, path:'/projects/' + id}, function(innerResult) {
						innerResult.statusCode.should.eql(200);
						var innerResponseParts = [];
						innerResult.setEncoding('utf8');
						innerResult.on("data", function(chunk) {
							innerResponseParts.push(chunk);
						});
						innerResult.on("end", function(){
							var innerResults = JSON.parse(innerResponseParts.join(''));
							
							innerResults.name.should.eql('P2');
							expect(innerResults.description).to.be.undefined;
							
							done();
						});
					});
				});
			});
		});
	});
	
	// Select specific project not existing
	it('Selects specific project not existing', function(done) {
		this.timeout(maximumRuntime);
		client.connect(connectionString, function(error, database) {
			if (error) {
				true.should.be.false;
			}

			var id = '000000000000000000000000';
			http.get({hostname:test.host, port:test.port, path:'/projects/' + id}, function(innerResult) {
				innerResult.statusCode.should.eql(404);
				done();
			});
		});
	});

	// Select specific project invalid id
	it('Selects specific project invalid id', function(done) {
		this.timeout(maximumRuntime);
		client.connect(connectionString, function(error, database) {
			if (error) {
				true.should.be.false;
			}

			var id = 'G00000000000000000000000';
			http.get({hostname:test.host, port:test.port, path:'/projects/' + id}, function(innerResult) {
				innerResult.statusCode.should.eql(400);
				done();
			});
		});
	});	
});