console.log("Starting Node.JS server...");

// -------------------------------
// Program Initialisation
// -------------------------------

var http = require('http');
var express = require('express');
var mysql = require('mysql');

var app = express();
let port = 8080;

let errorMsg = '[{\'data\' = \'null\'}]';
let requestConsoleMsg = function(method, url, id, content) {
    return "============================" +
           "\nGot HTTP request:" +
           "\n    Medthod: " + method +
           "\n    URL: " + url +
           (id ? "\n    ID: " + id : "") +
           (content ? "\n    Content: " + content : "")
}


// -------------------------------
// Connection do database
// -------------------------------

let dbConnexionData = {
    host       : 'database-nodejs',
    port       : '3306',
    //socketPath : '/var/run/mysqld/mysqld.sock',
    user       : 'my_user_1',
    password   : 'my_password_1',
    database   : 'my_database_1'
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
}, 15000)


// -------------------------------
// Request management
// -------------------------------

// GET method routes
app.get('/', function(req, res) {
    console.log(requestConsoleMsg("GET", req.get('host') + req.originalUrl));

    db.query("SELECT * FROM users", function (err, result) {
        res.send(!err ? result : errorMsg)
    });
});

app.get('/:id', function(req, res) {
    let id = req.params.id;

    console.log(requestConsoleMsg("GET", req.get('host') + req.originalUrl, id));

    db.query("SELECT * FROM users WHERE id=" + id, function (err, result) {
        res.send(!err ? result : errorMsg)
    });
});

// POST method route
app.post('/', function (req, res) {
    console.log(requestConsoleMsg("POST", req.get('host') + req.originalUrl, null, req.body.variable_name));
    res.send('not implemented');
});

// PUT method route
app.put('/', function (req, res) {
    console.log(requestConsoleMsg("POST", req.get('host') + req.originalUrl));
    res.send(errorMsg);
});

app.put('/:id', function (req, res) {
    let id = req.params.id;

    console.log(requestConsoleMsg("POST", req.get('host') + req.originalUrl, id));
    res.send('not implemented');
});

// DELETE method route
app.delete('/', function (req, res) {
    console.log(requestConsoleMsg("DELETE", req.get('host') + req.originalUrl));
    res.send(errorMsg);
});

app.delete('/:id', function (req, res) {
    let id = req.params.id;

    console.log(requestConsoleMsg("DELETE", req.get('host') + req.originalUrl, id));
    res.send('not implemented');
});


// -------------------------------
// Starting listening
// -------------------------------

app.listen(port, function() {
    console.log('Server is listening on ' + port)
});
