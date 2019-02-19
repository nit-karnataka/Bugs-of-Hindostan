const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const MongoStore = require('connect-mongo')(session);
const trieFunctions = require('./utils/trieFunctions');
const Trie = require('./utils/Trie');

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


// myTrie = new Trie()
// trieFunctions.add(myTrie.root, 'storag'); 
// trieFunctions.add(myTrie.root,'sole');
// trieFunctions.add(myTrie.root, 'doll'); 
// console.log(trieFunctions.print(myTrie.root));

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
//     console.log(trieFunctions.isWord(pdf.trie.root, 'storag'))
//     console.log(trieFunctions.isWord(pdf.trie.root, 'sole'))
//     console.log(trieFunctions.isWord(pdf.trie.root, 'doll'))
// })
// .catch(err => {
//     console.log(err);
// })

app.get('/query', (req,res)=>{
    res.render('query');
})

app.listen(CONFIG.SERVER.PORT, ()=>{
    console.log(`Server Started at http://localhost:${CONFIG.SERVER.PORT}/`);
})