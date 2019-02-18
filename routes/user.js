const route = require('express').Router();
const crypto = require('crypto');
const fs = require('fs');
const passport = require('passport');
const models = require('../models');
const auth = require('../utils/auth.js');
const { upload, cloudinary } = require("../utils/images");

route.post('/signup', (req,res,next) => {
     console.log(req.body)
    models.User
        .findOne({email: req.body.email})
        .then(existingUser =>{
            if(existingUser){
                req.flash('errors', 'Email already exists!');
                return res.redirect('/signup');
            } else {
                return models.User.create(req.body)
            }
        })
        .then(user=> {
            req.flash('signupSuccess', 'Successfully Signed Up!');
            res.redirect('/login');
        })
        .catch(err=> {
            console.log(`Error: ${err}`);
            res.redirect('/signup');
        })
});


route.get('/signup', (req,res) => {
    if(req.user)
        return res.redirect('/');
    res.render('signup', {errors: req.flash('errors')});
});


route.get('/login', (req,res) => {
    if(req.user)
        return res.redirect('/');
    res.render('login', {message: req.flash('loginMsg'), successMsg: req.flash('signupSuccess')});
});


route.get('/logout', (req, res)=>{
    if(req.user){
        req.logout();
        req.flash('homePgMsg', 'Successfully Logged Out!');
    }
    res.redirect('/');
});


route.get('/profile', auth.isLoggedIn, (req,res,next) => {
    models.User
        .findOne({_id: req.user._id})
        .then(user => {
            res.render('profile', {user, message: req.flash('editSuccess')});
        })
        .catch(err => {
            return next(err);
        })
})


route.get('/edit-profile', auth.isLoggedIn, (req,res,next) =>{
    res.render('editProfile.ejs');
})

route.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    successFlash: true,
    failureFlash: true
}))

module.exports = route;