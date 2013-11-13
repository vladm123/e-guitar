var config = require('../config');
var mongo = require('mongodb');
var client = mongo.MongoClient;
var bson = mongo.BSONPure.ObjectID;

var collectionName = config.data.database.mongodb.collection;
var connectionString = config.data.database.mongodb.connectionString;

/*
 * Selects all projects.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 * @param next The function called to process the result.
 */ 
exports.selectAll = function(request, response, next) {
    client.connect(connectionString, function(error, database) {
        if (error) {
            response.send(500, "Database connection failed.");
            return;
        }
        
        database.collection(collectionName)
            .find({})
            .toArray(function(error, projects) {
                if (error) {
                    response.send(500, "Database selection failed.");
                    return;
                }
                
                response.statusCode = 200;
                next(request, response, projects);
            });
    });
};

/*
 * Selects a project by id.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 * @param id The identifier for the project to be selected.
 * @param next The function called to process the result.
 */ 
exports.selectById = function(request, response, id, next) {
    client.connect(connectionString, function(error, database) {
        if (error) {
            response.send(500, "Database connection failed.");
            return;
        }
        
        database.collection(collectionName)
            .findOne({'_id': new bson(id)}, function(error, project) {
                if (error) {
                    response.send(500, "Database selection failed.");
                    return;
                }
                
                if (!(project)) {
                    response.send(404, "Project not found.");
                    return;
                }
                
                response.statusCode = 200;
                next(request, response, project);
            });
    });
};

/*
 * Inserts a project.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 * @param project The project to be inserted; the id will be auto.
 * @param next The function called to process the result.
 */ 
exports.insert = function(request, response, project, next) {
    client.connect(connectionString, function(error, database) {
        if (error) {
            response.send(500, "Database connection failed.");
            return;
        }
        
        database.collection(collectionName)
            .findAndModify(project,
				{'sort': ['name', 'asc']},
				project,
				{'new': true, 'upsert': true},
				function(error, project) {
					if (error) {
						response.send(500, "Database insertion failed.");
						return;
					}
					
					if (!(project)) {
						response.send(404, "Project not found.");
						return;
					}
					
					response.location('/projects/' + project._id);
					response.statusCode = 201;
					next(request, response, project);
				});
    });
};

/*
 * Updates a project.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 * @param id The identifier for the project to be updated.
 * @param project The project to be updated.
 * @param next The function called to process the result.
 */ 
exports.updateById = function(request, response, id, project, next) {
    client.connect(connectionString, function(error, database) {
        if (error) {
            response.send(500, "Database connection failed.");
            return;
        }
        
        database.collection(collectionName)
            .findAndModify({'_id': new bson(id)},
				{'sort': ['name', 'asc']},
                project,
                {'new': true},
                function(error, project) {
                    if (error) {
                        response.send(500, "Database update failed.");
                        return;
                    }
                    
                    if (!(project)) {
                        response.send(404, "Project not found.");
                        return;
                    }
                    
					response.statusCode = 200;
					next(request, response, project);
                });
    });
};

/*
 * Deletes a project by id.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 * @param id The identifier for the project to be deleted.
 * @param next The function called to process the result.
 */ 
exports.deleteById = function(request, response, id, next) {
    client.connect(connectionString, function(error, database) {
        if (error) {
            response.send(500, "Database connection failed.");
            return;
        }
        
        database.collection(collectionName)
            .findAndModify({'_id': new bson(id)},
				{'sort': ['name', 'asc']},
                {},
                {'remove': true},
                function(error, project) {
                    if (error) {
                        response.send(500, "Database deletion failed.");
                        return;
                    }
                    
                    if (!(project)) {
                        response.send(404, "Project not found.");
                        return;
                    }

					response.statusCode = 200;
					next(request, response, project);
                });
    });
};