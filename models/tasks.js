var config = require('../config');
var mongo = require('mongodb');
var client = mongo.MongoClient;
var bson = mongo.BSONPure.ObjectID;

var collectionName = config.data.database.mongodb.collection;
var connectionString = config.data.database.mongodb.connectionString;

/*
 * Inserts a task.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 * @param task The task to be inserted; the id will be auto.
 * @param projectid The identifier of the project to which the task belongs.
 * @param next The function called to process the result.
 */ 
exports.insertByTaskProjectId = function(request, response, task, projectid, next) {
    client.connect(connectionString, function(error, database) {
        if (error) {
            response.send(500, "Database connection failed.");
            return;
        }
        
        database.collection(collectionName)
            .findAndModify({'_id': new bson(projectid)},
				{'sort': ['name', 'asc']},
                {$push: {tasks: task}},
                {'new': true},
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
                    response.statusCode = 201;
					next(request, response, project);
                });
    });
};

/*
 * Updates a task.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 * @param task The task to be updated.
 * @param projectid The identifier of the project to which the task belongs.
 * @param next The function called to process the result.
 */ 
exports.updateByTaskProjectId = function(request, response, task, projectid, next) {
    client.connect(connectionString, function(error, database) {
        if (error) {
            response.send(500, "Database connection failed.");
            return;
        }
        
		// Remove all tasks with the same start date from within this project.
        database.collection(collectionName)
            .findAndModify({'_id': new bson(projectid)},
				{'sort': ['name', 'asc']},
				{$pull: {tasks: {start: {$in: [task.start]}}}},
                {'new': true},
				function(error, project) {
					if (error) {
						response.send(500, "Database update failed." + error);
						return;
					}
					
					if (!(project)) {
						response.send(404, "Project not found.");
						return;
					}
					
					// Add the current task to this project.
					database.collection(collectionName)
						.findAndModify({'_id': new bson(projectid)},
							{'sort': ['name', 'asc']},
							{ $push: { tasks: task }},
							{'new': true},
							function(error, project) {
								if (error) {
									response.send(500, "Database update failed." + error);
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
    });
};
				
/*
 * Deletes a task by id.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 * @param task The task to be deleted.
 * @param projectid The identifier of the project to which the task belongs.
 * @param next The function called to process the result.
 */ 
exports.deleteByTaskProjectId = function(request, response, task, projectid, next) {
    client.connect(connectionString, function(error, database) {
        if (error) {
            response.send(500, "Database connection failed.");
            return;
        }
        
        database.collection(collectionName)
            .findAndModify({'_id': new bson(projectid)},
				{'sort': ['name', 'asc']},
                {$pull: {tasks: {start: {$in: [task.start]}}}},
                {'new': true},
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