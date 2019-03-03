const route = require('express').Router();
const models = require('../models');
const auth = require('../utils/auth');

route.get('/:id', auth.isLoggedIn, (req, res) => {
    models.Query.findById(req.params.id)
    .then(query => {
        res.render('feedback', { user: req.user, query: query });
    })
    .catch(err => {
        console.log(err);
        res.redirect('back');
    })
})

route.post('/', auth.isLoggedIn, (req, res) => {
    models.Feedback.create({
        text: req.body.feedback,
        qid: req.body.qid,
        uid: req.body.uid
    })
    .then(fb => {
        console.log(fb);
    })
    .catch(err => {
        console.log(err);
    })
    res.redirect('/');
})

module.exports = route;
