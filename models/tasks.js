var mongo = require('mongodb');
var client = mongo.MongoClient;
var bson = mongo.BSONPure.ObjectID;
var collectionName = 'projects';
var connectionString =
    "mongodb://vladmanea:vladm123@ds053978.mongolab.com:53978/e-guitar";

/*
 * Inserts a task.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 * @param task The task to be inserted; the id will be auto.
 * @param projectid The identifier of the project to which the task belongs.
 */ 
exports.insertByTaskProjectId = function(request, response, task, projectid) {
    client.connect(connectionString, function(error, database) {
        if (error) {
            response.send(500, "Database connection failed.");
            return;
        }
        
        database.collection(collectionName)
            .update({'_id': new bson(projectid)},
                { $push: { tasks: task } },
                {safe: true},
                function(error, project) {
                    if (error) {
                        response.send(500, "Database insertion failed.");
                        return;
                    }
                    
                    if (!(project)) {
                        response.send(404, "Project not found.");
                        return;
                    }
                    
                    // The location is the set of related tasks.
                    response.location('/projects/' + projectid);
                    response.send(201);
                });
    });
};

/*
 * Updates a task.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 * @param id The identifier for the task to be updated.
 * @param task The task to be updated.
 * @param projectid The identifier of the project to which the task belongs.
 */ 
exports.updateByTaskProjectId = function(request, response, id, task, projectid) {
    client.connect(connectionString, function(error, database) {
        if (error) {
            response.send(500, "Database connection failed.");
            return;
        }
        
        database.collection(collectionName)
            .update({'_id': new bson(projectid)}, {
                $pull: { tasks: { $elemMatch: { start: task.start } } },
                $push: { tasks: task }
            }, function(error, project) {
                if (error) {
                    response.send(500, "Database update failed.");
                    return;
                }
                
                if (!(project)) {
                    response.send(404, "Project not found.");
                    return;
                }
                
                response.send(204);
            });
    });
};

/*
 * Deletes a task by id.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 * @param task The task to be deleted.
 * @param projectid The identifier of the project to which the task belongs.
 */ 
exports.deleteByTaskProjectId = function(request, response, task, projectid) {
    client.connect(connectionString, function(error, database) {
        if (error) {
            response.send(500, "Database connection failed.");
            return;
        }
        
        database.collection(collectionName)
            .update({'_id': new bson(projectid)},
                { $pull: { tasks: { $elemMatch: { start: task.start } } } },
                {safe: true},
                function(error, project) {
                    if (error) {
                        response.send(500, "Database deletion failed.");
                        return;
                    }
                        
                    if (!(project)) {
                        response.send(404, "Project not found.");
                        return;
                    }
                    
                    response.send(204);
                });
    });
};