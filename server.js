console.log("Starting Node.JS server...");

var http = require('http');
var express = require('express');
var mysql = require('mysql');

var app = express();

let con = mysql.createConnection({
    host: "localhost",
    user: "my_user_1",
    password: "my_password_1"
});

con.connect(function(err) {
    if (!err) {
        console.log("ERROR: Failed to connect to database")
    } else {
        console.log("Database connected!");
    }
});

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
