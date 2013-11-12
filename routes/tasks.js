var model = require('../models/tasks');

/*
 * Selects all tasks.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */
exports.selectByProjectId = function(request, response) {
    var projectid = request.params.projectid;
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
    model.insert(request, response, projectid, task);
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
    model.updateByIdProjectId(request, response, id, projectid, task);
};

/*
 * Deletes a task by id and project id.
 * @param request The HTTP request object.
 * @param response The HTTP response object.
 */
exports.deleteByIdProjectId = function(request, response) {
    var projectid = request.params.projectid;
    var id = request.params.id;
    model.deleteByIdProjectId(request, response, id, projectid);
};