const route = require('express').Router();
const models = require('../models');
const auth = require('../utils/auth');

route.get('/', auth.isLoggedIn, (req,res)=>{
    res.render('query');
})
route.post('/', auth.isLoggedIn, (req,res)=>{
    keywords = req.body.keywords.split(';')
    let query = new models.Query()
    query.keywords = keywords
    query.email.push(req.body.selfEmail)
    query.user = req.user._id
    query.dateUploaded = Date.now()
    if(!req.user.isTeacher)
        query.email.push(req.body.teacherEmail)

    query
        .save()
        .then(query=> {
            return models.User.findById(req.user.id);
        })
        .then(user=> {
            user.pastQueries.push(query.id);
            return user.save();
        })      
        .then(user=>{
            return queryProcess(query.id);
        })
        .then(()=>{
            req.flash('homePgSuccess', 'Successfully submitted the query.');
            res.redirect('/');
        })
        .catch(err => {
            req.flash('homePgFail', 'Error uploading query. Please try again.');
            return res.redirect('/');   
        })

    res.redirect('/');
})

module.exports = route;
