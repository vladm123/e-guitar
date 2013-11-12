var mongo = require('mongodb');
var client = mongo.MongoClient;
var bson = mongo.BSONPure.ObjectID;
var collectionName = 'tasks';
var connectionString =
    "mongodb://vladmanea:vladm123@ds053978.mongolab.com:53978/e-guitar";

/*
 * Selects tasks by project id.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 * @param projectid The identifier of the project to which the tasks belong.
 * @param next The function called to process the result.
 */ 
exports.selectByProjectId = function(request, response, projectid, next) {
    client.connect(connectionString, function(error, database) {
        if (error) {
            response.send(500, "Database connection failed.");
            return;
        }
        
        database.collection(collectionName)
            .find({'_projectid': projectid})
            .toArray(function(error, tasks) {
                if (error) {
                    response.send(500, "Database selection failed.");
                    return;
                }
                
                response.statusCode = 200;
                next(request, response, tasks);
            });
    });
};

/*
 * Inserts a task.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 * @param projectid The identifier of the project to which the task belongs.
 * @param task The task to be inserted; the id will be auto.
 */ 
exports.insertByProjectId = function(request, response, projectid, task) {
    client.connect(connectionString, function(error, database) {
        if (error) {
            response.send(500, "Database connection failed.");
            return;
        }
        
        // Set the project identifier to the task.
        task._projectid = new bson(projectid);
        
        database.collection(collectionName)
            .insert(task,
                {safe: true}, 
                function(error, tasks) {
                    if (error) {
                        response.send(500, "Database insertion failed.");
                        return;
                    }
                    
                    // The location is the set of related tasks.
                    response.location('/projects/' + projectid + '/tasks');
                    response.send(201);
                });
    });
};

/*
 * Updates a task.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 * @param id The identifier for the task to be updated.
 * @param projectid The identifier of the project to which the task belongs.
 * @param task The task to be updated.
 */ 
exports.updateByIdProjectId = function(request, response, id, projectid, task) {
    client.connect(connectionString, function(error, database) {
        if (error) {
            response.send(500, "Database connection failed.");
            return;
        }
        
        // Set the project identifier to the task (override any values if any).
        task._projectid = new bson(projectid);
        
        database.collection(collectionName)
            .update({'_id': new bson(id), '_projectid': new bson(projectid)},
                task,
                {safe: true},
                function(error, task) {
                    if (error) {
                        response.send(500, "Database update failed.");
                        return;
                    }
                    
                    if (!(task)) {
                        response.send(404, "Task not found.");
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
 * @param id The identifier for the task to be deleted.
 * @param projectid The identifier of the project to which the task belongs.
 */ 
exports.deleteByIdProjectId = function(request, response, id, projectid) {
    client.connect(connectionString, function(error, database) {
        if (error) {
            response.send(500, "Database connection failed.");
            return;
        }
        
        database.collection(collectionName)
            .remove({'_id': new bson(id), '_projectid': new bson(projectid)},
                {safe: true},
                function(error, tasks) {
                    if (error) {
                        response.send(500, "Database deletion failed.");
                        return;
                    }
                    
                    console.log(tasks);
                    console.log(tasks[0]);
                    
                    if (!(tasks[0])) {
                        response.send(404, "Task not found.");
                        return;
                    }
                    
                    response.send(204);
                });
    });
};