var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

app.configure(function() {
    
    // Bulk configure, should remove if not used
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(require('stylus').middleware(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'public')));
    
    // For development only
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }
});

// General routes
app.get('/', function(req, res) { res.send("OK"); })

// Routes for projects
var projects = require('./routes/projects');
app.get('/projects', projects.selectAll);
app.get('/projects/:id', projects.selectById);
app.post('/projects/insert', projects.insert);
app.post('/projects/:id/update', projects.updateById);
app.post('/projects/:id/delete', projects.deleteById);

// Routes for tasks inside projects
var tasks = require('./routes/tasks');
app.post('projects/:projectid/tasks/insert', tasks.insertByTaskProjectId);
app.post('projects/:projectid/tasks/update', tasks.updateByTaskProjectId);
app.post('projects/:projectid/tasks/delete', tasks.deleteByTaskProjectId);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});