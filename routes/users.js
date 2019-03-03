const route = require('express').Router();
const models = require('../models');
const auth = require('../utils/auth');

route.get('/:id', auth.isLoggedIn, (req, res) => {
    let title = ""
    let id = Number(req.params.id);

    if(id == 0) title = "All Research Department Members"
    else if(id == 1) title = "All Students"
    else title = "All Mentors"

    models.User.find({ isStudent: id })
    .then(users => {
        if(users === null) {
            throw Error('No users found');
        }
        res.render('users', { title: title, users: users });
    })
    .catch(err => {
        console.log(`Error: ${err}`);l
        res.redirect('/');
    })
});

module.exports = route;
