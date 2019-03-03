const route = require('express').Router();
const models = require('../../models');
const auth = require('../../utils/auth');

route.get('/:id', auth.isLoggedIn, (req, res) => {
    models.User.find({ isStudent: Number(req.params.id) })
    .then(students => {
        res.send(students);
    })
    .catch(err => {
        console.log(`Error: ${err}`);
        res.redirect('back');
    });
});

module.exports = route;
