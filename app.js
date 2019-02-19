const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const MongoStore = require('connect-mongo')(session);
const trieFunctions = require('./utils/trieFunctions');
const Trie = require('./utils/Trie');
const auth = require('./utils/auth');

const app = express();

const passport = require('./passport');
const db = require('./db');

const models = require('./models');

const CONFIG = require('./config');

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

// console.log("abc")
// console.log(trieFunctions);
// console.log("abc")


// myTrie = new Trie()
// trieFunctions.add(myTrie.root, 'ball'); 
// trieFunctions.add(myTrie.root,'bat'); 
// trieFunctions.add(myTrie.root, 'doll'); 
// console.log(trieFunctions.isWord(myTrie.root, 'doll'))
// console.log(trieFunctions.isWord(myTrie.root, 'dor'))
// console.log(trieFunctions.isWord(myTrie.root, 'dorf'))
// console.log(trieFunctions.print(myTrie.root))

// models.Pdf.create({
//     name: 'first',
//     dateUploaded: Date.now(),
//     trie: myTrie
// })
// .then(pdf => {
//     console.log(pdf)
// })
// .catch(err => {
//     console.log("Error aagya");
//     console.log(err);
// })

// models.Pdf.findOne({})
// .then(pdf => {
//     console.log(pdf);
//     console.log(trieFunctions.isWord(pdf.trie.root, 'dolll'))
//     console.log(trieFunctions.isWord(pdf.trie.root, 'doll'))
//     console.log(trieFunctions.isWord(pdf.trie.root, 'ba'))
// })
// .catch(err => {
//     console.log(err);
// })

app.get('/query', auth.isLoggedIn, (req,res)=>{
    res.render('query');
})
app.post('/query', auth.isLoggedIn, (req,res)=>{
    keywords = req.body.keywords.split(';')
    let query = new models.Query()
    query.keywords = keywords
    query.email.push(req.body.selfEmail)
    query.user = req.user._id
    query.dateUploaded = Date.now()
    if(!req.user.isTeacher)
        query.email.push(req.body.teacherEmail)

    query
        .save()
        .then(query=> {
            return models.User.findById(req.user.id);
        })
        .then(user=> {
            user.pastQueries.push(query.id);
            return user.save();
        })      
        .then(user=>{
            req.flash('homePgSuccess', 'Successfully submitted the query.');
            res.redirect('/');
        })
        .catch(err => {
            req.flash('homePgFail', 'Error uploading query. Please try again.');
            return res.redirect('/');   
        })

    res.redirect('/');
})

app.listen(CONFIG.SERVER.PORT, ()=>{
    console.log(`Server Started at http://localhost:${CONFIG.SERVER.PORT}/`);
})