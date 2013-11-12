var mongo = require('mongodb');
var client = mongo.MongoClient;
var bson = mongo.BSONPure.ObjectID;
var collectionName = 'projects';
var connectionString =
    "mongodb://vladmanea:vladm123@ds053978.mongolab.com:53978/e-guitar";

/*
 * Selects all projects.
 * @param next The function called to process the result.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */ 
exports.selectAll = function(next, request, response) {
    client.connect(connectionString, function(error, database) {
        var projects = database.collection(collectionName);
        
        projects.find({}).toArray(function(error, projects) {
            next(request, response, projects);
        });
    });
};

/*
 * Selects a project by id.
 * @param id The identifier for the project to be selected.
 * @param next The function called to process the result.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */ 
exports.selectById = function(id, next, request, response) {
    client.connect(connectionString, function(error, database) {
        var projects = database.collection(collectionName);
        
        projects.findOne({'_id': new bson(id)}, function(error, project) {
            next(request, response, project);
        });
    });
}

/*
 * Inserts a project.
 * @param project The project to be inserted; the id will be auto.
 * @param next The function called to process the result.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */ 
exports.insert = function(project, next, request, response) {
    client.connect(connectionString, function(error, database) {
        var projects = database.collection(collectionName);
        
        projects.insert(project, {safe: true}, function(error, projects) {
            next(request, response, projects[0]);
        });
    });
};

/*
 * Updates a project.
 * @param id The identifier for the project to be updated.
 * @param project The project to be updated.
 * @param next The function called to process the result.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */ 
exports.update = function(id, project, next, request, response) {
    client.connect(connectionString, function(error, database) {
        var projects = database.collection(collectionName);
        
        projects.update({'_id': new bson(id)}, project, {safe: true}, function(error, project) {
            next(request, response, project);          
        });
    });
};

/*
 * Deletes a project by id.
 * @param id The identifier for the project to be deleted.
 * @param next The function called to process the result.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */ 
exports.deleteById = function(id, next, request, response) {
    client.connect(connectionString, function(error, database) {
        var projects = database.collection(collectionName);
        
        projects.remove({'_id': new bson(id)}, {safe: true}, function(error, projects) {
            console.log(projects);
            console.log(projects[0]);
            next(request, response, projects[0]);
        });
    });
}