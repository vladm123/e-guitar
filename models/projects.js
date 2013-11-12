var mongo = require('mongodb');
var client = mongo.MongoClient;
var bson = mongo.BSONPure.ObjectID;
var collectionName = 'projects';
var connectionString = "mongodb://vladmanea:vladm123@ds053978.mongolab.com:53978/e-guitar";

exports.selectAll = function(next) {
    client.connect(connectionString, function(error, database) {
        var projects = database.collection(collectionName);
        
        projects.find({}).toArray(function(error, projects) {
            next(projects);
        });
    });
};

exports.selectById = function(id, next) {
    client.connect(connectionString, function(error, database) {
        var projects = database.collection(collectionName);
        
        projects.findOne({'_id': new bson(id)}, function(error, project) {
            next(project);
        });
    });
}

exports.insert = function(project, next) {
    client.connect(connectionString, function(error, database) {
        var projects = database.collection(collectionName);
        
        projects.insert(project, {safe: true}, function(error, projects) {
            next(projects[0]);
        });
    });
};

exports.deleteById = function(id, next) {
    client.connect(connectionString, function(error, database) {
        var projects = database.collection(collectionName);
        
        projects.remove({'_id': new bson(id)}, {safe: true}, function(error, projects) {
            next(projects[0]);
        });
    });
}