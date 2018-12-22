var express = require('express');
var app = express();
var path = require('path');
var request = require('request');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use('/public', express.static(path.join(__dirname, 'static')));

app.get('/', function(req, res){
    console.log("serving index");
    res.sendFile(path.join(__dirname + '/static/index.html'))
});


var uri2 = 'https://api.fortnitetracker.com/v1/profile/';
app.post('/accountId', function(req, res){
    console.log(req.body);
    request.get(uri2 + req.body.platform + '/' + req.body.username.toLowerCase(), {
        headers: {
            'TRN-Api-Key': 'a768e120-a23b-4880-a2a3-fdbdda42c52a'
        }}, function(error, response, body){
            res.json(body);
        });
});

// https://api.fortnitetracker.com/v1/profile/account/{accountId}/matches
// 'TRN-Api-Key': 'a768e120-a23b-4880-a2a3-fdbdda42c52a'
var uri = 'https://api.fortnitetracker.com/v1/profile/account/';
app.post('/', function(req, res){
    console.log(req.body);
    request.get(uri + req.body.accountId + '/matches', {
        headers: {
            'TRN-Api-Key': 'a768e120-a23b-4880-a2a3-fdbdda42c52a'
        }}, function(error, response, body){
            //console.log("body: " + body);
            res.json(body);
        });
});


var port = process.env.PORT || 3000;
app.listen(port);