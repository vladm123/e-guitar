var config = require('./config');
var path = require('path');

var projectControllers = require(path.join(config.data.controller.path, 'projects'));
var taskControllers = require(path.join(config.data.controller.path, 'tasks'));

exports.setup = function(app) {
	// General routes.
	app.get('/', function(req, res) { res.send("OK"); })

	// Routes for projects.
	app.get('/projects', projectControllers.selectAll);
	app.get('/projects/:id', projectControllers.selectById);
	app.post('/projects/insert', projectControllers.insert);
	app.post('/projects/:id/update', projectControllers.updateById);
	app.post('/projects/:id/delete', projectControllers.deleteById);

	// Routes for tasks inside projects.
	app.post('/projects/:projectid/tasks/insert', taskControllers.insertByTaskProjectId);
	app.post('/projects/:projectid/tasks/update', taskControllers.updateByTaskProjectId);
	app.post('/projects/:projectid/tasks/delete', taskControllers.deleteByTaskProjectId);
};