var mongo = require('mongodb');
var client = mongo.MongoClient;
var bson = mongo.BSONPure.ObjectID;
var collectionName = 'projects';
var connectionString =
    "mongodb://vladmanea:vladm123@ds053978.mongolab.com:53978/e-guitar";

/*
 * Selects all projects.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 * @param next The function called to process the result.
 */ 
exports.selectAll = function(request, response, next) {
    client.connect(connectionString, function(error, database) {
        if (error) {
            response.send(500);
            return;
        }
        
        var projects = database.collection(collectionName);
        
        projects.find({}).toArray(function(error, projects) {
            if (error) {
                response.send(500);
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
            response.send(500);
            return;
        }
        
        var projects = database.collection(collectionName);
        
        projects.findOne({'_id': new bson(id)}, function(error, project) {
            if (error) {
                response.send(500);
                return;
            }
            
            if (!(response)) {
                response.send(404);
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
 */ 
exports.insert = function(request, response, project) {
    client.connect(connectionString, function(error, database) {
        if (error) {
            response.send(500);
            return;
        }
        
        var projects = database.collection(collectionName);
        
        projects.insert(project, {safe: true}, function(error, projects) {
            if (error) {
                response.send(500);
                return;
            }
            
            response.location('/' + collectionName + '/' + projects[0]._id);
            response.send(201);
        });
    });
};

/*
 * Updates a project.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 * @param id The identifier for the project to be updated.
 * @param project The project to be updated.
 */ 
exports.updateById = function(request, response, id, project) {
    client.connect(connectionString, function(error, database) {
        if (error) {
            response.send(500);
            return;
        }
        
        var projects = database.collection(collectionName);
        
        projects.update({'_id': new bson(id)}, project, {safe: true}, function(error, project) {
            if (error) {
                response.send(500);
                return;
            }
            
            if (!(project)) {
                response.send(404);
                return;
            }
            
            response.send(204);
        });
    });
};

/*
 * Deletes a project by id.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 * @param id The identifier for the project to be deleted.
 */ 
exports.deleteById = function(request, response, id) {
    client.connect(connectionString, function(error, database) {
        if (error) {
            response.send(500);
            return;
        }
        
        var projects = database.collection(collectionName);
        
        projects.remove({'_id': new bson(id)}, {safe: true}, function(error, projects) {
            if (error) {
                response.send(500);
                return;
            }
            
            console.log(projects);
            console.log(projects[0]);
            
            if (!(projects[0])) {
                response.send(404);
                return;
            }
            
            response.send(204);
        });
    });
};