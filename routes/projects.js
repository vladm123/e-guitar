var model = require('../models/projects');

exports.selectAll = function(req, res) {
    model.selectAll(function(projects) {
        res.send(projects);
    });
};

exports.selectById = function(req, res) {
    model.selectById(req.params.id, function(project) {
        res.send(project);
    })
}

exports.insert = function(req, res) {
    model.insert({'haha': 'hahb'}, function(project) {
        res.send(project);
    });
};

exports.deleteById = function(req, res) {
    model.deleteById(req.params.id, function(project) {
        res.send(project);
    });
};