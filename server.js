const express = require('express');
const mysql = require('mysql');
const app = express();
var bodyParser = require('body-parser');
var methodOvereide = require('method-override');
var cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(methodOvereide());
app.use(express.static(__dirname + '/dist/bro-job-finder'));

const allowedOrigins = [
    'capacitor://localhost',
    'ionic://localhost',
    'http://localhost',
    'http://localhost:8080',
    'http://localhost:8100'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Origin not allowed by CORS'));
        }
    }
}
app.options('*', cors(corsOptions));

app.get('/', cors(corsOptions), (req, res, next) => {
    res.sendFile(path.join(__dirname+'/dist/bro-job-finder/index.html'));
    res.json({ message: 'This route is CORS-enabled for an allowed origin.' });
})
    
const db = mysql.createPool({
    connectionLimit: 100,
    host: 'a2nlmysql25plsk.secureserver.net',
    user: 'Bro',
    password: 'Qwertyuiop1234',
    database: 'Brogrammers'
});

db.getConnection((err1) => {
    console.log('Connecting mySQL....')
    if (err1) {
        throw err1;
    }
    console.log('Mysql connected....')
    db.query('select * from Administrator;', function (err2, result, field) {
        if (!err2) {
            console.log(result);
        }
        else {
            console.log(err2)
        }
    });
});

// Basic things to include
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function () {
    console.log("listening to Port", app.get("port"));
});

// Password Hash
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.route('/signup', cors(corsOptions)).post(function (request, response) {
    var email = request.body.Email; //this is from signup.page.ts
    var password = request.body.Password;

    db.query('SELECT * FROM Administrator WHERE email = ?;', [email], function (error, result, fields) {
        if (!error) {
            if (result.length > 0) {
                response.send(false)
            } else {
                // Hashing and salting password
                bcrypt.hash(password, saltRounds, function (err, hash) {
                    db.query("INSERT INTO UserAccount (email,password)VALUES(?,?);", [email, hash], function (error, result, fields) {
                        if (!error) {
                            console.log('Row inserted:', result);
                        } else {
                            console.log(error);
                        }
                        response.send(true);
                    })
                });
            }
        } else {
        console.log(error);
        }
    });
});

app.get('/admin',cors(corsOptions), (req,res,next) => 
{
    db.query('SELECT * FROM Administrator', function (error,result)
    {
        if (!error)
        {
            res.json({message:result});
        }
    })
}
)