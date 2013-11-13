var config = require('../config');
var path = require('path');

var model = require(path.join(config.data.model.path, 'tasks'));
var idRegex = config.data.validation.idRegex;
var lgRegex = config.data.validation.lgRegex;

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
	
	// Start matches a long number, if exists.
	if ((task.start) && !(task.start.toString().match(lgRegex))) {
        response.send(400, "Invalid task start.");
        return;
	}
	
	// Add the start time stamp to the task object, if not exists.
	if (!(task.start)) {
        task.start = new Date().getTime();
	}
	
	// End matches a long number, if exists.
	if ((task.end) && !(task.end.toString().match(lgRegex))) {
        response.send(400, "Invalid task start.");
        return;
	}

    var taskObject = {
        'name': task.name,
        'description': task.description,
        'start': task.start,
		'end': task.end
    };
    model.insertByTaskProjectId(request, response, taskObject, projectid, 
		function(request, response, project) {
			response.format({
				json: function() {
					response.json(project);
				}
			});
		});
};

/*
 * Updates a task by project id.
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
	
	// Start matches a long number.
	if (!(task.start.toString().match(lgRegex))) {
        response.send(400, "Invalid task start.");
        return;
	}

	// End matches a long number, if exists.
	if ((task.end) && !(task.end.toString().match(lgRegex))) {
        response.send(400, "Invalid task end.");
        return;
	}
	
	if ((task.end) && (task.start > task.end)) {
        response.send(400, "Overflown task end.");
        return;
	}

    var taskObject = {
        'name': task.name,
        'description': task.description,
        'start': task.start,
        'end': task.end
    };
    model.updateByTaskProjectId(request, response, taskObject, projectid,
		function(request, response, project) {
			response.format({
				json: function() {
					response.json(project);
				}
			});
		});
};

/*
 * Deletes a task by project id.
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
	
	// Start matches a long number.
	if (!(task.start.toString().match(lgRegex))) {
        response.send(400, "Invalid task start.");
        return;
	}

    var taskObject = {
        'start' : task.start
    };
    model.deleteByTaskProjectId(request, response, taskObject, projectid,
		function(request, response, project) {
			response.format({
				json: function() {
					response.json(project);
				}
			});
		});
};