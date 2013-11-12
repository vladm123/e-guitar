var model = require('../models/tasks');
var idRegex = /\b[0-9A-F]{24}\b/gi;

/*
 * Selects all tasks.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */
exports.selectByProjectId = function(request, response) {
    var projectid = request.params.projectid;
    
    // ID is a 24-hex string.
    if (!(projectid.match(idRegex))) {
        response.send(400, "Invalid project identifier.");
        return;
    }

    model.selectAll(request, response, projectid, function(request, response, tasks) {
        response.format({
            json: function() { 
                response.json(tasks);
            }
        });
    });
};

/*
 * Inserts a task.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */
exports.insertByProjectId = function(request, response) {
    var projectid = request.params.projectid;
    var task = request.body;

    // ID is a 24-hex string.
    if (!(projectid.match(idRegex))) {
        response.send(400, "Invalid project identifier.");
        return;
    }
    
    // Name is mandatory.
    if (!(task.name)) {
        response.send(400, "Missing task name.");
        return;
    }

    var taskObject = {
        'name': task.name,
        'description': task.description,

        // Add the start timestamp to the task object.
        'start': new Date().getTime()
    };
    model.insertByProjectId(request, response, projectid, taskObject);
};

/*
 * Updates a task by id and project id.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */
exports.updateByIdProjectId = function(request, response) {
    var projectid = request.params.projectid;
    var id = request.params.id;
    var task = request.body;
    
    // ID is a 24-hex string.
    if (!(projectid.match(idRegex))) {
        response.send(400, "Invalid project identifier.");
        return;
    }

    // ID is a 24-hex string.
    if (!(id.match(idRegex))) {
        response.send(400, "Invalid task identifier.");
        return;
    }

    // Name is mandatory.
    if (!(task.name)) {
        response.send(400, "Missing task name.");
        return;
    }

    // Add the end timestamp to the task object.
    if (!(task.end)) {
        task.end = new Date().getTime();
    }

    var taskObject = {
        'name': task.name,
        'description': task.description,

        // Add the start timestamp to the task object.
        'start': new Date().getTime()
    };
    model.updateByIdProjectId(request, response, id, projectid, taskObject);
};

/*
 * Deletes a task by id and project id.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */
exports.deleteByIdProjectId = function(request, response) {
    var projectid = request.params.projectid;
    var id = request.params.id;
    
    // ID is a 24-hex string.
    if (!(projectid.match(idRegex))) {
        response.send(400, "Invalid project identifier.");
        return;
    }

    // ID is a 24-hex string.
    if (!(id.match(idRegex))) {
        response.send(400, "Invalid task identifier.");
        return;
    }

    model.deleteByIdProjectId(request, response, id, projectid);
};