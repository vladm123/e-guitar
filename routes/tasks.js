var model = require('../models/tasks');
var idRegex = /\b[0-9A-F]{24}\b/gi;

/*
 * Inserts a task.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */
exports.insertByTaskProjectId = function(request, response) {
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
    model.insertByTaskProjectId(request, response, taskObject, projectid);
};

/*
 * Updates a task by id and project id.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */
exports.updateByTaskProjectId = function(request, response) {
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

    // Start is mandatory.
    if (!(task.start)) {
        response.send(400, "Missing task start.");
        return;
    }

    var taskObject = {
        'name': task.name,
        'description': task.description,
        'start': task.start,
        'end': task.end
    };
    model.updateByTaskProjectId(request, response, taskObject, projectid);
};

/*
 * Deletes a task by id and project id.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */
exports.deleteByTaskProjectId = function(request, response) {
    var projectid = request.params.projectid;
    var task = request.body;
    
    // ID is a 24-hex string.
    if (!(projectid.match(idRegex))) {
        response.send(400, "Invalid project identifier.");
        return;
    }

    // Start is mandatory.
    if (!(task.start)) {
        response.send(400, "Missing task start.");
        return;
    }

    var taskObject = {
        'start' : task.start
    };
    model.deleteByTaskProjectId(request, response, taskObject, projectid);
};