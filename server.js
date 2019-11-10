// -------------------------------
// Requires
// -------------------------------

var express = require('express');
var bodyParser = require("body-parser");
var mysql = require('mysql');

// -------------------------------
// Global Variabmes
// -------------------------------

var hostname = 'localhost';
var port = 8080;
let errorMsg = '[{\'data\' = \'null\'}]';
let successMsg = '[{\'success\' = \'true\'}]'
let badRequestMsg = '[{\'badRequest\' = \'true\'}]'


// -------------------------------
// Main objects
// -------------------------------

var app = express();
var myRouter = express.Router();


// -------------------------------
// Global Functions
// -------------------------------

let requestConsoleMsg = function (method, url, content) {
    return "========================================================" +
        "\nGot HTTP request:" +
        "\n    Medthod: " + method +
        "\n    URL: " + url +
        (content ? "\n    Content: " + JSON.stringify(content) : "")
};


// -------------------------------
// Body parser
// -------------------------------

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// -------------------------------
// Connection do database
// -------------------------------

let dbConnexionData = {
    host: 'database-nodejs',
    port: '3306',
    //socketPath : '/var/run/mysqld/mysqld.sock',
    user: 'my_user_1',
    password: 'my_password_1',
    database: 'my_database_1'
};

let db = mysql.createConnection(dbConnexionData);

setTimeout(function () {
    db.connect(function (err) {
        if (err) {
            console.error('Error connecting to MySQL: ' + err.stack);
            return;
        }
        console.log('Database connected as id ' + db.threadId);
    });
}, 15000)


// -------------------------------
// Route and Application Core
// -------------------------------

myRouter.route('/')
    .all(function (req, res) {
        res.json({
            message: "National BDE API", methode: req.method
        });
    });

myRouter.route('/users')

    .get(function (req, res) {
        console.log(requestConsoleMsg("GET", req.get('host') + req.originalUrl));

        let condition = "";

        if (req.query.id) {
            condition = " WHERE id=" + req.query.id;
        } else if (req.query.email) {
            condition = " WHERE email=\'" + req.query.email + "\'";
        }

        let request = "SELECT * FROM users" + condition;
        console.log(request);

        db.query(request, function (err, result) {
            res.json(!err ? result : 'Unable to answer request')
        });
    })

    .post(function (req, res) {
        console.log(requestConsoleMsg("POST", req.get('host') + req.originalUrl, req.body));

        let name = req.body.name;
        let email = req.body.email;
        let passwordHash = req.body.passwordHash;
        let school = req.body.school;
        let role = req.body.role;

        if (name != null && name != undefined &&
            email != null && email != undefined &&
            passwordHash != null && passwordHash != undefined
        ) {
            let request = "INSERT INTO users (name, email, passwordHash, school, role)" +
                ` VALUES ('${name}', '${email}', '${passwordHash}', '${school}', '${role}')`

            console.log(request);

            db.query(request, function (err, result) {
                res.json(!err ? sucessMsg : errorMsg)
                if (err) { console.log("[WARN] MySQL error: " + err) }
            });
        } else {
            console.log('Failed to POST: ' + `${name}, ${email}, ${passwordHash}, ${school}, ${role}`);
            res.json('Cannot create user while at least one value is missing');
        }
    })

    .put(function (req, res) {
        console.log(requestConsoleMsg("PUT", req.get('host') + req.originalUrl, req.body));

        let id = req.query.id;

        if (!id) {
            res.json('Cannot update user while no ID is specified');
        } else {
            let request = "UPDATE users SET ";

            let keys = Object.keys(req.body);

            if (keys.length >= 1) {

                keys.map((key, index) => {
                    request += `\`${key}\` = "${req.body[key]}"` + (index < keys.length - 1 ? ', ' : '')
                });

                request = request + ` WHERE id=${id}`;

                console.log(request);

                db.query(request, function (err, result) {
                    res.json(!err ? successMsg : errorMsg)
                    if (err) { console.log("[WARN] MySQL error: " + err) }
                });
            } else {
                res.json('Cannot update user while no values to change');
            }
        }
    })

    .delete(function (req, res) {
        console.log(requestConsoleMsg("DELETE", req.get('host') + req.originalUrl, req.body));

        let id = req.query.id;

        if (id) {
            let request = `DELETE FROM users WHERE id=${id}`;

            db.query(request, function (err, result) {
                res.json(!err ? successMsg : errorMsg);
            })
        } else {
            res.json('Cannot delete user while no ID is specified');
        }
    });


// -------------------------------
// Starting Application
// -------------------------------

app.use(myRouter);

app.listen(port, function () {
    console.log("Running Node.JS Server on http://" + hostname + ":" + port);
});
