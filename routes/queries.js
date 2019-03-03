const route = require('express').Router();
const models = require('../models');
const auth = require('../utils/auth');

route.get('/', auth.isLoggedIn, (req, res) => {
    models.Query.find()
    .then(queries => {
        if(queries === null) {
            throw Error('No queries found');
        }
        res.render('queries', { title: 'All Queries', queries: queries });
    })
    .catch(err => {
        console.log(`Error: ${err}`);l
        res.redirect('/');
    })
});

route.get('/:id', auth.isLoggedIn, (req, res) => {
    models.User.findById(req.params.id)
    .populate('pastQueries')
    .then(user => {
        res.render('queries', { title: user.name, queries: user.pastQueries });
    })
    .catch(err => {
        console.log(err);
    })
});

module.exports = route;
