console.log("Starting Node.JS server...");

var http = require('http');
var express = require('express');

var app = express();

// GET method route
app.get('/', function (req, res) {
    res.send('GET request to the homepage');
});

// POST method route
app.post('/', function (req, res) {
    res.send('POST request to the homepage');
});

// PUT method route
app.put('/', function (req, res) {
    res.send('PUT request to the homepage');
});

app.listen(8080);
