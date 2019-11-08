console.log("Starting Node.JS server...");

// -------------------------------
// Program Initialisation
// -------------------------------

var http = require('http');
var express = require('express');
var mysql = require('mysql');

var app = express();
let port = 8080;


// -------------------------------
// Connextion do database
// -------------------------------

let dbConnexionData = {
    host       : 'localhost',
    port       : '3307',
    //socketPath : '/var/run/mysqld/mysqld.sock',
    user       : 'root',
    password   : '',
    database   : 'cesibde'
};

let db = mysql.createConnection(dbConnexionData);

setTimeout(function() {
    db.connect(function(err) {
        if (err) {
            console.error('Error connecting to MySQL: ' + err.stack);
            return;
        }
        console.log('Database connected as id ' + db.threadId);
    });
}, 10000)


// -------------------------------
// Request management
// -------------------------------

// GET method routes
app.get('/', function(req, res) {
    console.log('GET request on ' + req.get('host') + req.originalUrl);

    let data = "none";

    db.query("SELECT * FROM users", function (err, result) {
        console.log("Result: " + result);
        data = result;
    });

    res.send('GET all users. Result = ' + data);
});

app.get('/:id', function(req, res) {
    console.log('GET request on ' + req.get('host') + req.originalUrl);

    let data = "none";
    let id = 1;

    db.query("SELECT * FROM users WHERE id=" + id, function (err, result) {
        console.log("Result: " + result);
        data = result;
    });

    res.send('GET user ' + id + '. Result = ' + data);
});

// POST method route
app.post('/', function (req, res) {
    console.log('POST request');
    res.send('POST request to the homepage');
});

// PUT method route
app.put('/', function (req, res) {
    console.log('PUT request');
    res.send('PUT request to the homepage');
});

// DELETE method route
app.delete('/', function (req, res) {
    console.log('DELETE request');
    res.send('DELETE request to the homepage');
});


// -------------------------------
// Starting listening
// -------------------------------

app.listen(port, function() {
    console.log('Server is listening on ' + port)
});
