var model = require('../models/projects');

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
    model.insert(request, response, project);
};

/*
 * Updates a project by id.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */
exports.updateById = function(request, response) {
    var id = request.params.id;
    var project = request.body;
    model.updateById(request, response, id, project);
};

/*
 * Deletes a project by id.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */
exports.deleteById = function(request, response) {
    var id = request.params.id;
    model.deleteById(request, response, id);
};