//var config = require('./config');
var express = require('express');
var cookieParser = require('cookie-parser');

//var date = require('datejs');
//var twilio = require('twilio');
var app = express();
//var calendar = gapi.calendar('v3');

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

app.use(allowCrossDomain);
app.use(express.static(__dirname + '/static'));

require('./api/authorization/routes')(app);

//require('./api/apps/expense/routes')(app);
app.listen(process.env.port || 3000);

console.log('listening...')