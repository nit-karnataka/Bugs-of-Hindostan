const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const MongoStore = require('connect-mongo')(session);
const queryProcess = require('./utils/query');

const app = express();

const passport = require('./passport');
const db = require('./db');

const models = require('./models');

const CONFIG = require('./config');

const updateTime = 45000
const setIntervalTime = 20000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.set('view engine', 'ejs');

app.use(flash());
app.use(cookieParser(CONFIG.COOKIE_SECRET_KEY));
app.use(session({
    secret: CONFIG.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: db.connection })
}));

app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next)=>{
    res.locals.user = req.user;
    next();
});

app.use('/', require('./routes'));

// setInterval(() => {
//     models.Query.find({ lastUpdated: { $lte: Date.now() - updateTime } })
//     .then((queries) => {
//         console.log(Date.now())
//         console.log(queries.length);
//         queries.forEach(query => {
//             console.log(query.email);
//             queryProcess(query.keywords, query)
//             .then(text => {
//                 console.log(text);
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//         })
//     })
//     .catch(err => {
//         console.log("Error in query finding");
//         console.log(err);
//     })
// }, Number(setIntervalTime));

const chalJaBhai = () => {
    return new Promise((resolve,reject)=>{
        const { spawn } = require('child_process');
        const pyProg = spawn('py', ['public_static/python/try.py']);  
        console.log('yaha0')
        pyProg.stdout.on('data', (data) => {
            data = data.toString();
            console.log('yaha')
            console.log(data)
            resolve(data);
        });

        pyProg.stderr.on('data', (err) => {
            console.log('ye to aya')
            console.log(err.toString())
            reject(err);
        })
    });
}
app.get('/python', (req,res)=>{
    chalJaBhai()
    .then(noErr => {
        console.log(noErr)
        console.log('chal gya')
        res.redirect('/success')
    })
    .catch(err=>{
        console.log(`Err: ${err}`)
        res.redirect('/failure')
    })
})

app.listen(CONFIG.SERVER.PORT, ()=>{
    console.log(`Server Started at http://localhost:${CONFIG.SERVER.PORT}/`);
})