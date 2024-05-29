require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('node:path');
const mongoose = require('mongoose');
const passport = require('passport');

const mongoURI = process.env.MONGO_URI;
const router = require('./routes/index');

mongoose.connect(mongoURI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

const app = express();
app.locals.moment = require('moment');

// SET
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const sessionStore = MongoStore.create({
    mongoUrl: mongoURI,
    collectionName: 'sessions',
});

require('./middleware/passport');

// USE

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: 'cats', // a secret string used to sign the session ID cookie
        resave: false, // don't save session if unmodified
        saveUninitialized: true,
        store: sessionStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // expire in 1 day
        },
    })
);
app.use(passport.session());
app.use('/', router);

// LISTEN
app.listen(3000, () => console.log('app listening on port 3000, open http://localhost:3000'));
