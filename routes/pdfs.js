const route = require('express').Router();
const models = require('../models');
const auth = require('../utils/auth');

route.get('/', auth.isLoggedIn, (req, res) => {
    models.Pdf.find()
    .then(pdfs => {
        res.render('pdfs', { pdfs });
    })
    .catch(err => {
        console.log(err);
        res.redirect('back');
    }) 
})

module.exports = route;
