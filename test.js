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
			try {
				result.statusCode.should.eql(200);
				done();
			} catch (error) {
				done(error);
			}
		}).on('error', function(error) {
			try {
				true.should.be.false;
			} catch (error) {
				done(error);
			}
		});
	});
});

describe('Project select all', function() {
	before(function(done) {
		this.timeout(maximumRuntime);
		client.connect(connectionString, function(error, database) {
			if (error) {
				try {
					true.should.be.false;
				} catch (error) {
					done(error);
				}
			}
			
			// Remove all projects
			database.collection(collectionName) 
				.remove(function(error, removed) {
					if (error) {
						try {
							true.should.be.false;
						} catch (error) {
							done(error);
						}
					}
				
					// Add two projects
					database.collection(collectionName)
						.insert([
								{'name':'P1', 'description':'D1'},
								{'name':'P2'}
							],
							function(error, result) {
								if (error) {
									try {
										true.should.be.false;
									} catch (error) {
										done(error);
									}
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
				try {
					true.should.be.false;
				} catch (error) {
					done(error);
				}
			}
			
			http.get({hostname:test.host, port:test.port, path:'/projects'}, 
				function(result) {
					try {
						result.statusCode.should.eql(200);
						result.headers['content-type'].should.eql('application/json');
					} catch (error) {
						done(error);
					}

					var responseParts = [];
					result.setEncoding('utf8');
					result.on('data', function(chunk) {
						responseParts.push(chunk);
					});
					result.on('end', function(){
						var results = JSON.parse(responseParts.join(''));
						
						try {
							results.length.should.eql(2);
						
							results[0].name.should.eql('P2');
							expect(results[0].description).to.be.undefined;
						
							results[1].name.should.eql('P1');
							results[1].description.should.eql('D1');
						
							done();
						} catch (error) {
							done(error);
						}
					});
				}).on('error', function(error) {
					try {
						true.should.be.false;
					} catch (error) {
						done(error);
					}
				});
		});
	});
	
	// Select specific project
	it('Selects specific project', function(done) {
		this.timeout(maximumRuntime);
		client.connect(connectionString, function(error, database) {
			if (error) {
				try {
					true.should.be.false;
				} catch (error) {
					done(error);
				}
			}
			
			http.get({hostname:test.host, port:test.port, path:'/projects'}, 
				function(result) {
					try {
						result.statusCode.should.eql(200);
						result.headers['content-type'].should.eql('application/json');
					} catch (error) {
						done(error);
					}

					var responseParts = [];
					result.setEncoding('utf8');
					result.on('data', function(chunk) {
						responseParts.push(chunk);
					});
					result.on('end', function(){
						var results = JSON.parse(responseParts.join(''));
						var id = results[0]._id;
						http.get({hostname:test.host, port:test.port, path:'/projects/' + id}, 
							function(innerResult) {
								try {
									innerResult.statusCode.should.eql(200);
								} catch (error) {
									done(error);
								}
									
								var innerResponseParts = [];
								innerResult.setEncoding('utf8');
								innerResult.on('data', function(chunk) {
									innerResponseParts.push(chunk);
								});
								innerResult.on('end', function(){
									var innerResults = JSON.parse(innerResponseParts.join(''));
									
									try {
										innerResults.name.should.eql('P2');
										expect(innerResults.description).to.be.undefined;
										done();
									} catch (error) {
										done(error);
									}
								});
							});
					});
				}).on('error', function(error) {
					try {
						true.should.be.false;
					} catch (error) {
						done(error);
					}
				});
		});
	});
	
	// Select specific project not existing
	it('Selects specific project not existing', function(done) {
		this.timeout(maximumRuntime);
		client.connect(connectionString, function(error, database) {
			if (error) {
				try {
					true.should.be.false;
				} catch (error) {
					done(error);
				}
			}

			var id = '000000000000000000000000';
			http.get({hostname:test.host, port:test.port, path:'/projects/' + id}, 
				function(innerResult) {
					try {
						innerResult.statusCode.should.eql(404);
						done();
					} catch (error) {
						done(error);
					}
				}).on('error', function(error) {
					try {
						true.should.be.false;
					} catch (error) {
						done(error);
					}
				});
			});
	});

	// Select specific project invalid id
	it('Selects specific project invalid id', function(done) {
		this.timeout(maximumRuntime);
		client.connect(connectionString, function(error, database) {
			if (error) {
				try {
					true.should.be.false;
				} catch (error) {
					done(error);
				}
			}

			var id = 'G00000000000000000000000';
			http.get({hostname:test.host, port:test.port, path:'/projects/' + id},
				function(innerResult) {
					try {
						innerResult.statusCode.should.eql(400);
						done();
					} catch (error) {
						done(error);
					}
				}).on('error', function(error) {
					try {
						true.should.be.false;
					} catch (error) {
						done(error);
					}
				});
		});
	});	
});

describe('Project insert', function() {
	before(function(done) {
		this.timeout(maximumRuntime);

		client.connect(connectionString, function(error, database) {
			if (error) {
				try {
					true.should.be.false;
				} catch (error) {
					done(error);
				}
			}
			
			// Remove all projects
			database.collection(collectionName) 
				.remove(function(error, removed) {
					if (error) {
						try {
							true.should.be.false;
						} catch (error) {
							done(error);
						}
					}
					
					done();
				});
		});
	});

	// Insert a project
	it('Inserts a project', function(done) {
		this.timeout(maximumRuntime);
		client.connect(connectionString, function(error, database) {
			if (error) {
				try {
					true.should.be.false;
				} catch (error) {
					done(error);
				}
			}
			
			var project = JSON.stringify({'name': 'P', 'description': 'D'});
			
			var request = http.request({
					method: 'POST', 
					hostname:test.host, 
					port:test.port, 
					path:'/projects/insert',
					headers: {
						'Content-Type': 'application/json',
						'Content-Length': project.length
					}
				}, 
				function(result) {
					try {
						result.statusCode.should.eql(201);
						result.headers['content-type'].should.eql('application/json');
					} catch (error) {
						done(error);
					}

					var responseParts = [];
					result.setEncoding('utf8');
					result.on('data', function(chunk) {
						responseParts.push(chunk);
					});
					result.on('end', function(){
						var innerResult = JSON.parse(responseParts.join(''));

						try {
							('/projects/' + innerResult._id)
								.should.eql(result.headers['location']);
						
							innerResult.name.should.eql('P');
							innerResult.description.should.eql('D');
							innerResult.tasks.should.eql([]);
						
							done();
						} catch (error) {
							done(error);
						}
					});
				}).on('error', function(error) {
					try {
						true.should.be.false;
					} catch (error) {
						done(error);
					}
				});
			
			request.write(project);
			request.end();
		});
	});
	
	// Insert a project without name
	it('Inserts a project without name', function(done) {
		this.timeout(maximumRuntime);
		client.connect(connectionString, function(error, database) {
			if (error) {
				try {
					true.should.be.false;
				} catch (error) {
					done(error);
				}
			}
			
			var project = JSON.stringify({'description': 'D'});
			
			var request = http.request({
					method: 'POST', 
					hostname:test.host, 
					port:test.port, 
					path:'/projects/insert',
					headers: {
						'Content-Type': 'application/json',
						'Content-Length': project.length
					}
				}, 
				function(result) {
					try {
						result.statusCode.should.eql(400);
						done();
					} catch (error) {
						done(error);
					}

				}).on('error', function(error) {
					try {
						true.should.be.false;
					} catch (error) {
						done(error);
					}
				});
			
			request.write(project);
			request.end();
		});
	});
	
	// Insert a project without description
	it('Inserts a project without description', function(done) {
		this.timeout(maximumRuntime);
		client.connect(connectionString, function(error, database) {
			if (error) {
				try {
					true.should.be.false;
				} catch (error) {
					done(error);
				}
			}
			
			var project = JSON.stringify({'name': 'P'});
			
			var request = http.request({
					method: 'POST', 
					hostname:test.host, 
					port:test.port, 
					path:'/projects/insert',
					headers: {
						'Content-Type': 'application/json',
						'Content-Length': project.length
					}
				}, 
				function(result) {
					try {
						result.statusCode.should.eql(201);
						result.headers['content-type'].should.eql('application/json');
					} catch (error) {
						done(error);
					}
  
					var responseParts = [];
					result.setEncoding('utf8');
					result.on('data', function(chunk) {
						responseParts.push(chunk);
					});
					result.on('end', function(){
						var innerResult = JSON.parse(responseParts.join(''));
						
						try {
							innerResult.name.should.eql('P');
							expect(innerResult.description).to.be.undefined;

							done();
						} catch (error) {
							done(error);
						}
					});
				}).on('error', function(error) {
					try {
						true.should.be.false;
					} catch (error) {
						done(error);
					}
				});
			
			request.write(project);
			request.end();
		});
	});
	
	// Insert a project with an extra field
	it('Inserts a project with an extra field', function(done) {
		this.timeout(maximumRuntime);
		client.connect(connectionString, function(error, database) {
			if (error) {
				try {
					true.should.be.false;
				} catch (error) {
					done(error);
				}
			}
			
			var project = JSON.stringify({'name': 'P', 'description': 'D', 'extra': 'E'});
			
			var request = http.request({
					method: 'POST', 
					hostname:test.host, 
					port:test.port, 
					path:'/projects/insert',
					headers: {
						'Content-Type': 'application/json',
						'Content-Length': project.length
					}
				}, 
				function(result) {
					try {
						result.statusCode.should.eql(201);
						result.headers['content-type'].should.eql('application/json');
					} catch (error) {
						done(error);
					}

					var responseParts = [];
					result.setEncoding('utf8');
					result.on('data', function(chunk) {
						responseParts.push(chunk);
					});
					result.on('end', function(){
						var innerResult = JSON.parse(responseParts.join(''));
						
						try {
							expect(innerResult.extra).to.be.undefined;

							done();
						} catch (error) {
							done(error);
						}
					});
				}).on('error', function(error) {
					try {
						true.should.be.false;
					} catch (error) {
						done(error);
					}
				});
			
			request.write(project);
			request.end();
		});
	});
});

describe('Project update', function() {
	before(function(done) {
		client.connect(connectionString, function(error, database) {
			if (error) {
				try {
					true.should.be.false;
				} catch (error) {
					done(error);
				}
			}
			
			// Remove all projects
			database.collection(collectionName) 
				.remove(function(error, removed) {
					if (error) {
						try {
							true.should.be.false;
						} catch (error) {
							done(error);
						}
					}
					
					done();
				});
		});
	});

	// Update a project
	it('Updates a project', function(done) {
		this.timeout(maximumRuntime);
		client.connect(connectionString, function(error, database) {
			if (error) {
				try {
					true.should.be.false;
				} catch (error) {
					done(error);
				}
			}
			
			var initialProject = JSON.stringify({'name': 'IP', 'description': 'ID'});
			var updatedProject = JSON.stringify({'name': 'UP', 'description': 'UD'});
			
			var insertRequest = http.request({
					method: 'POST', 
					hostname:test.host, 
					port:test.port, 
					path:'/projects/insert',
					headers: {
						'Content-Type': 'application/json',
						'Content-Length': initialProject.length
					}
				}, 
				function(insertResult) {
					try {
						insertResult.statusCode.should.eql(201);
					} catch (error) {
						done(error);
					}

					var responseParts = [];
					insertResult.setEncoding('utf8');
					insertResult.on('data', function(chunk) {
						responseParts.push(chunk);
					});
					insertResult.on('end', function(){
						var insertInnerResult = JSON.parse(responseParts.join(''));

						var updateRequest = http.request({
							method: 'POST', 
							hostname:test.host, 
							port:test.port, 
							path:'/projects/' + insertInnerResult._id + '/update',
							headers: {
								'Content-Type': 'application/json',
								'Content-Length': updatedProject.length
							}
						},
						function(updateResult) {
							try {
								updateResult.statusCode.should.eql(200);
								updateResult.headers['content-type'].should.eql('application/json');
							} catch (error) {
								done(error);
							}
		  
							var responseParts = [];
							updateResult.setEncoding('utf8');
							updateResult.on('data', function(chunk) {
								responseParts.push(chunk);
							});
							updateResult.on('end', function(){
								var updateInnerResult = JSON.parse(responseParts.join(''));
								
								try {
									updateInnerResult.name.should.eql('UP');
									updateInnerResult.description.should.eql('UD');
									updateInnerResult.tasks.should.eql([]);
	
									done();
								} catch (error) {
									done(error);
								}
							});
						}).on('error', function(error) {
							try {
								true.should.be.false;
							} catch (error) {
								done(error);
							}
						});

						updateRequest.write(updatedProject);
						updateRequest.end();
					});
				}).on('error', function(error) {
					try {
						true.should.be.false;
					} catch (error) {
						done(error);
					}
				});
			
			insertRequest.write(initialProject);
			insertRequest.end();
		});
	});

	// Update a project with a missing description
	it('Updates a project with a missing description', function(done) {
		this.timeout(maximumRuntime);
		client.connect(connectionString, function(error, database) {
			if (error) {
				try {
					true.should.be.false;
				} catch (error) {
					done(error);
				}
			}
			
			var initialProject = JSON.stringify({'name': 'IP', 'description': 'ID'});
			var updatedProject = JSON.stringify({'name': 'UP'});
			
			var insertRequest = http.request({
					method: 'POST', 
					hostname:test.host, 
					port:test.port, 
					path:'/projects/insert',
					headers: {
						'Content-Type': 'application/json',
						'Content-Length': initialProject.length
					}
				}, 
				function(insertResult) {
					try {
						insertResult.statusCode.should.eql(201);
					} catch (error) {
						done(error);
					}

					var responseParts = [];
					insertResult.setEncoding('utf8');
					insertResult.on('data', function(chunk) {
						responseParts.push(chunk);
					});
					insertResult.on('end', function(){
						var insertInnerResult = JSON.parse(responseParts.join(''));

						var updateRequest = http.request({
							method: 'POST', 
							hostname:test.host, 
							port:test.port, 
							path:'/projects/' + insertInnerResult._id + '/update',
							headers: {
								'Content-Type': 'application/json',
								'Content-Length': updatedProject.length
							}
						},
						function(updateResult) {
							try {
								updateResult.statusCode.should.eql(200);
								updateResult.headers['content-type'].should.eql('application/json');
							} catch (error) {
								done(error);
							}
		  
							var responseParts = [];
							updateResult.setEncoding('utf8');
							updateResult.on('data', function(chunk) {
								responseParts.push(chunk);
							});
							updateResult.on('end', function(){
								var updateInnerResult = JSON.parse(responseParts.join(''));
								
								try {
									updateInnerResult.name.should.eql('UP');
									expect(updateInnerResult.description).to.be.undefined;
									updateInnerResult.tasks.should.eql([]);
	
									done();
								} catch (error) {
									done(error);
								}
							});
						}).on('error', function(error) {
							try {
								true.should.be.false;
							} catch (error) {
								done(error);
							}
						});

						updateRequest.write(updatedProject);
						updateRequest.end();
					});
				}).on('error', function(error) {
					try {
						true.should.be.false;
					} catch (error) {
						done(error);
					}
				});
			
			insertRequest.write(initialProject);
			insertRequest.end();
		});
	});
});

describe('Project delete', function() {
	before(function(done) {
		client.connect(connectionString, function(error, database) {
			if (error) {
				try {
					true.should.be.false;
				} catch (error) {
					done(error);
				}
			}
			
			// Remove all projects
			database.collection(collectionName) 
				.remove(function(error, removed) {
					if (error) {
						try {
							true.should.be.false;
						} catch (error) {
							done(error);
						}
					}
					
					done();
				});
		});
	});

	// Delete a project
	it('Deletes a project', function(done) {
		this.timeout(maximumRuntime);
		client.connect(connectionString, function(error, database) {
			if (error) {
				try {
					true.should.be.false;
				} catch (error) {
					done(error);
				}
			}
			
			var initialProject = JSON.stringify({'name': 'IP', 'description': 'ID'});
			
			var insertRequest = http.request({
					method: 'POST', 
					hostname:test.host, 
					port:test.port, 
					path:'/projects/insert',
					headers: {
						'Content-Type': 'application/json',
						'Content-Length': initialProject.length
					}
				}, 
				function(insertResult) {
					try {
						insertResult.statusCode.should.eql(201);
					} catch (error) {
						done(error);
					}

					var responseParts = [];
					insertResult.setEncoding('utf8');
					insertResult.on('data', function(chunk) {
						responseParts.push(chunk);
					});
					insertResult.on('end', function(){
						var insertInnerResult = JSON.parse(responseParts.join(''));

						var deleteRequest = http.request({
							method: 'POST', 
							hostname:test.host, 
							port:test.port, 
							path:'/projects/' + insertInnerResult._id + '/delete',
							headers: {
								'Content-Type': 'application/json',
								'Content-Length': 0
							}
						},
						function(deleteResult) {
							try {
								deleteResult.statusCode.should.eql(200);
								deleteResult.headers['content-type'].should.eql('application/json');
							} catch (error) {
								done(error);
							}
		  
							var responseParts = [];
							deleteResult.setEncoding('utf8');
							deleteResult.on('data', function(chunk) {
								responseParts.push(chunk);
							});
							deleteResult.on('end', function(){
								var deleteInnerResult = JSON.parse(responseParts.join(''));
								
								try {
									deleteInnerResult.name.should.eql('IP');
									deleteInnerResult.description.should.eql('ID');
									deleteInnerResult.tasks.should.eql([]);
	
									done();
								} catch (error) {
									done(error);
								}
							});
						}).on('error', function(error) {
							try {
								true.should.be.false;
							} catch (error) {
								done(error);
							}
						});

						deleteRequest.write('');
						deleteRequest.end();
					});
				}).on('error', function(error) {
					try {
						true.should.be.false;
					} catch (error) {
						done(error);
					}
				});
			
			insertRequest.write(initialProject);
			insertRequest.end();
		});
	});
});