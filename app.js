var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.bodyParser({keepExtensions: true, uploadDir: path.join(__dirname, "screenshots")}));
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

app.get('/', function(req, res) { res.send("OK"); })

var projects = require('./routes/projects');
app.get('/projects', projects.selectAll);
app.get('/projects/:id', projects.selectById);
app.post('/projects', projects.insert);
app.put('/projects/:id', projects.updateById);
app.delete('/projects/:id', projects.deleteById);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});


/*
request.files."name of the input field".path -> where it is uploaded



*/