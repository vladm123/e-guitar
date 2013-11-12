var model = require('../models/projects');

/*
 * Selects all projects.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */
exports.selectAll = function(request, response) {
    model.selectAll(function(projects) {
        response.send(projects);
    });
};

/*
 * Selects a project by id.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */
exports.selectById = function(request, response) {
    var id = request.params.id;
    model.selectById(id, function(project) {
        response.send(project);
    })
}

/*
 * Inserts a project.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */
exports.insert = function(request, response) {
    var project = request.body;
    model.insert(project, function(project) {
        response.send(project);
    });
};

/*
 * Updates a project by id.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */
exports.updateById = function(request, response) {
    var id = request.params.id;
    var project = request.body;
    model.updateById(id, project, function(project) {
        response.send(project);
    });
};

/*
 * Deletes a project by id.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */
exports.deleteById = function(request, response) {
    var id = request.params.id;
    model.deleteById(id, function(project) {
        response.send(project);
    });
};