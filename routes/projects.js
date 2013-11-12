var model = require('../models/projects');
var idRegex = /\b[0-9A-F]{24}\b/gi;

/*
 * Selects all projects.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */
exports.selectAll = function(request, response) {
    model.selectAll(request, response, function(request, response, projects) {
        response.format({
            json: function() { 
                response.json(projects);
            }
        });
    });
};

/*
 * Selects a project by id.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */
exports.selectById = function(request, response) {
    var id = request.params.id;
    
    // ID is a 24-hex string.
    if (!(id.match(idRegex))) {
        response.send(400, "Invalid project identifier.");
        return;
    }

    model.selectById(request, response, id, function(request, response, project) {
        response.format({
            json: function() {
                response.json(project);
            }
        });
    })
};

/*
 * Inserts a project.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */
exports.insert = function(request, response) {
    var project = request.body;
    
    // Name is mandatory.
    if (!(project.name)) {
        response.send(400, "Missing project name.");
        return;
    }
    
    var projectObject = {
        'name': project.name,
        'description': project.description,
        
        // Add an empty array of tasks.
        'tasks': []
    };
    model.insert(request, response, projectObject);
};

/*
 * Updates a project by id.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */
exports.updateById = function(request, response) {
    var id = request.params.id;
    var project = request.body;

    // Name is mandatory.
    if (!(project.name)) {
        response.send(400, "Missing project name.");
        return;
    }

    // ID is a 24-hex string.
    if (!(id.match(idRegex))) {
        response.send(400, "Invalid project identifier.");
        return;
    }

    var projectObject = {
        'name': project.name,
        'description': project.description,
        'tasks': project.tasks
    };
    model.updateById(request, response, id, projectObject);
};

/*
 * Deletes a project by id.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */
exports.deleteById = function(request, response) {
    var id = request.params.id;
    
    // ID is a 24-hex string.
    if (!(id.match(idRegex))) {
        response.send(400, "Invalid project identifier.");
        return;
    }

    model.deleteById(request, response, id);
};