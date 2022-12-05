#!/usr/bin/env node

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , member = require('./routes/member')
    , absence = require('./routes/absence')
    , mongoose = require('mongoose')
  , http = require('http')
    ,bodyParser = require('body-parser')
, path = require('path');
var restResponse = require('express-rest-response');

require("dotenv").config();

var app = express();

//Connect to mongodb
var DB_URL = process.env.DB_URI;	//define in .env
//Connect to mongodb
var connect = function () {
  var options = {
    socketTimeoutMS: 0,
    keepAlive: true,
    useUnifiedTopology: true,	//able to retry connection
    useNewUrlParser: true,
    dbName: 'crewmeister'};
  mongoose.connect(DB_URL, options);
};
connect();
mongoose.Promise = require('bluebird');
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);
// all environments
app.set('port', process.env.PORT || 3001);		//3000 default port
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
//========== define Rest response
var rest_resp_options = {
  showStatusCode: true,
  showDefaultMessage: true
};
app.use(restResponse(rest_resp_options));
// development only
if ('development' == app.get('env')) {
  app.use(function(err, req, res, next) {
    res.status(err.status || 404);
    res.render('error', {
      message: err.message,
      error: err
    });
    console.log(err);
  });
}
app.use('/', routes);
app.use('/member', member);
app.use('/absence', absence);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
