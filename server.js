// -------------------------------
// README
// -------------------------------
/*
 * Please consule ressources below that helped to build this application
 * - (fr) https://www.frugalprototype.com/developpez-propre-api-node-js-express/
 * - (en) https://dev.to/medaymentn/securing-your-node-js-api-with-json-web-token-5o5
 */


// -------------------------------
// Requires
// -------------------------------

let express = require('express');
let bodyParser = require("body-parser");
let mysql = require('mysql');
let jwt = require('jsonwebtoken');


// -------------------------------
// Global Variabmes
// -------------------------------

let secretUser = "utilisateurultrasecretdelapi"
let secretPassword = 'motdepasseultrascretdelapi';

let hostname = 'localhost';
let port = 8080;

let errorMsg = '[{\'data\' = \'null\'}]';
let successMsg = '[{\'success\' = \'true\'}]'
let badRequestMsg = '[{\'badRequest\' = \'true\'}]'

let consoleSeparator = "========================================================\n";


// -------------------------------
// Main objects
// -------------------------------

let app = express();
let router = express.Router();

app.set('Secret', secretPassword);
app.use('/users', router);


// -------------------------------
// Global Functions
// -------------------------------

let requestConsoleMsg = function (method, url, content) {
    return consoleSeparator +
        "Got HTTP request:" +
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
        console.log(consoleSeparator + 'Database connected as id ' + db.threadId);
    });
}, 15000)


// -------------------------------
// Token Protection
// -------------------------------

router.use((req, res, next) => {
    // check header for the token
    var token = req.headers['access-token'];

    // decode token
    if (token) {
        // verifies secret and checks if the token is expired
        jwt.verify(token, app.get('Secret'), (err, decoded) => {
            if (err) {
                return res.json({ message: 'invalid token' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {
        res.send({
            message: 'No token provided.'
        });

    }
});


// -------------------------------
// Route and Application Core
// -------------------------------

router.route('/users')

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

        if (name != null && name != undefined && name != 'undefined' &&
            email != null && email != undefined && email != 'undefined' &&
            passwordHash != null && passwordHash != undefined && passwordHash != 'undefined'
        ) {
            let request = "INSERT INTO users (name, email, passwordHash, school, role)" +
                ` VALUES ('${name}', '${email}', '${passwordHash}', '${school}', '${role}')`

            console.log(request);

            db.query(request, function (err, result) {
                res.json(!err ? successMsg : errorMsg)
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

app.post('/auth', (req, res) => {
    console.log(requestConsoleMsg("POST", req.get('host') + req.originalUrl, req.body));

    if (req.body.username === secretUser) {

        if (req.body.password === secretPassword) {
            //if eveything is okey let's create our token 

            const payload = {
                check: true
            };

            var token = jwt.sign(payload, app.get('Secret'), {
                expiresIn: 1440 // expires in 24 hours
            });

            res.json({
                message: 'authentication done ',
                token: token
            });

        } else {
            res.json({ message: "please check your password !" })
        }
    } else {
        res.json({ message: "user not found !" })
    }
})


// -------------------------------
// Starting Application
// -------------------------------

app.use(router);

app.listen(port, function () {
    console.log(consoleSeparator + "Running Node.JS Server on http://" + hostname + ":" + port);
});
