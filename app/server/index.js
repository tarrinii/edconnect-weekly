require('dotenv').config();

const express = require('express');
const register = require('@react-ssr/express/register');
const childProcess = require("child_process");
const path = require("path");
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('express-flash');

const SERVER_PORT = process.env.SERVER_PORT;

childProcess.execSync(`${path.join(__dirname, "../node_modules/.bin/md-seed")} run`);

const app = express();

app.use('/uploads', express.static('routes/uploads'));

(async () => {
    await register(app);

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    app.use(morgan('combined'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(session({
        secret: 'SOmeSEcretSalt!',
        cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
        resave: true,
        saveUninitialized: false
    }));
    app.use(flash());

    app.use('/', require('./routes/api'));
    app.use('/', require('./routes/router'));

    app.listen(SERVER_PORT, () => {
        console.log(`Server running on port ${SERVER_PORT}`)
    });
})();
