const route = require('express').Router();
const models = require('../models');
const passport = require('passport');
const auth = require('../utils/auth.js');

route.get('/signup', (req,res) => {
    if(req.user)
        return res.redirect('/');
    res.render('signup', {errors: req.flash('errors')});
})
route.get('/login', (req,res) => {
    if(req.user)
        return res.redirect('/');
    res.render('login', {message: req.flash('loginMsg')});
})
route.get('/logout', (req, res)=>{
    req.logout();
    req.flash('homePgMsg', 'Successfully Logged Out!');
    res.redirect('/');
});
route.get('/profile', auth.isLoggedIn, (req,res,next) => {
    models.User
        .findOne({_id: req.user._id})
        .then(user => {
            res.render('profile', {user});
        })
        .catch(err => {
            return next(err);
        })
})
route.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    successFlash: true,
    failureFlash: true
}))
route.post('/signup', (req,res,next) => {
    var user = new models.User();
    
    user.name = req.body.name;
    user.password = req.body.password;
    user.email = req.body.email;

    models.User
        .findOne({email: req.body.email})
        .then(existingUser =>{
            if(existingUser){
                req.flash('errors', 'Email already exists!');
                return res.redirect('/signup');
            } else {
                return user.save();
            }
        })
        .then(user=> {
            res.redirect('/login');
        })
        .catch(err=> {
            console.log(`Error: ${err}`);
            res.redirect('/signup');
        })
})

module.exports = route;