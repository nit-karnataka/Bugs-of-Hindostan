const route = require('express').Router();
const models = require('../models');
const auth = require('../utils/auth');

route.get('/', auth.isLoggedIn, (req, res) => {
    models.Query.find()
    .then(queries => {
        if(queries === null) {
            throw Error('No queries found');
        }
        res.render('queries', { queries });
    })
    .catch(err => {
        console.log(`Error: ${err}`);l
        res.redirect('/');
    })
});

module.exports = route;
