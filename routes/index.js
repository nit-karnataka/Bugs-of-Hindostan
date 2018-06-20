const express = require("express");
const path = require("path");

const route = express.Router();

route.use('/', express.static(path.join(__dirname, '../public_static')));

route.get('/', (req,res)=>{
    res.render('index', {message: req.flash('homePgMsg')});
});

// Sub Routes
route.use('/', require('./user'));

module.exports = route;