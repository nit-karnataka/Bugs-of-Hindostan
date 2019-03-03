const route = require('express').Router();
const models = require('../../models');
const auth = require('../../utils/auth');

route.get('/', auth.isLoggedIn, (req, res) => {
    models.User.find({ isTeacher: true })
    .then(students => {
        res.send(students);
    })
    .catch(err => {
        console.log(`Error: ${err}`);
        res.redirect('back');
    });
});

module.exports = route;
