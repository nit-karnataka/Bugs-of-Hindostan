const route = require('express').Router();
const models = require('../models');
const auth = require('../utils/auth');

route.get('/s', auth.isLoggedIn, (req, res) => {
    models.User.find()
    .then(users => {
        if(users === null) {
            throw Error('No users found');
        }
        res.render('users', { title: 'All Students', users: users });
    })
    .catch(err => {
        console.log(`Error: ${err}`);l
        res.redirect('/');
    })
});

route.get('/t', auth.isLoggedIn, (req, res) => {
    models.User.find()
    .then(users => {
        if(users === null) {
            throw Error('No users found');
        }
        res.render('users', { title: 'All Teachers/ Mentors', users: users });
    })
    .catch(err => {
        console.log(`Error: ${err}`);l
        res.redirect('/');
    })
});

module.exports = route;
