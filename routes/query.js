const route = require('express').Router();
const models = require('../models');
const auth = require('../utils/auth');
const queryProcess = require('../utils/query');

const processKeywords = (keywords)=> {
    return new Promise((resolve,reject)=>{
        const { spawn } = require('child_process')
        const pyProg = spawn('python', ['public_static/python/processing.py', keywords])
        pyProg.stdout.on('data', (data) => {
            data = data.toString()
            data = data.slice(0, -3) // contains three extra characters at end- ' ', '\r', '\n'
            data = data.split(' ')
            console.log(data)
            resolve(data);
        });
    
        pyProg.stderr.on('data', (err) => {
            console.log(`python ka error: ${err}`)
            reject(err);
        })
    })
}

route.get('/', auth.isLoggedIn, (req,res)=>{
    res.render('query');
})
route.post('/', auth.isLoggedIn, (req,res)=>{
    keywords = req.body.keywords.split(';')
    processKeywords(keywords)
    .then((newKeywords) => {
        let query = new models.Query()
        query.keywords = keywords
        query.email.push(req.body.selfEmail)
        query.user = req.user._id
        query.dateUploaded = Date.now()
        if(!req.user.isTeacher)
            query.email.push(req.body.teacherEmail)
        
        query.save()
        .then(query => {
            return queryProcess(newKeywords, query);
        })
        .then(text => {
            console.log(`email: ${text}`)
            return models.User.findById(req.user.id);
        })
        .then(user=> {
            user.pastQueries.push(query);
            return user.save();
        })
        .then(user=>{
            console.log(user);
            req.flash('homePgSuccess', 'Successfully submitted the query.');
            return res.redirect('/');
        })
        .catch(err => {
            console.log("Error in query saving");
        })
    })
    .catch(err => {
        req.flash('homePgFail', 'Error uploading query. Please try again.');
        return res.redirect('/');   
    })
    res.redirect('/');
});

module.exports = route;
