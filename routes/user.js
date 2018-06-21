const route = require('express').Router();
const crypto = require('crypto');
const fs = require('fs');
const passport = require('passport');
const models = require('../models');
const auth = require('../utils/auth.js');
const { upload, cloudinary } = require("../utils/images");

const uploadImageandCreateUser = req => {
    if (req.file) {
        return cloudinary.uploader.upload(req.file.path)
            .then(result => {
                fs.unlink(req.file.path);
                return models.User.create({
                    ...req.body,
                    picture: result.url
                })
            });
    } else {
        let size = 200;
        let md5 = crypto.createHash('md5').update(req.body.email).digest('hex');
        let url = 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';

        return models.User.create({
            ...req.body,
            orientation: 'gravatar',
            picture: url
        });
    }
};

route.post('/signup', upload.single('profilePic'), (req,res,next) => {
     
    models.User
        .findOne({email: req.body.email})
        .then(existingUser =>{
            if(existingUser){
                req.flash('errors', 'Email already exists!');
                return res.redirect('/signup');
            } else {
                return uploadImageandCreateUser(req);
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
route.post('/edit-profile', auth.isLoggedIn, (req,res,next) => {
    models.User
        .findById(req.user._id)
        .then(user => {
            user.name = req.body.name;
            user.address = req.body.address;
            return user.save();
        })
        .then(user => {
            req.flash('editSuccess', 'Successfully edited your profile!');
            res.redirect('/profile');
        })
        .catch(err => {
            return next(err);
            res.redirect('/profile');
        })
})
route.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    successFlash: true,
    failureFlash: true
}))

module.exports = route;