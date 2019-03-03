const route = require('express').Router();
const models = require('../models');
const auth = require('../utils/auth');
const queryProcess = require('../utils/query');

const processKeywords = (keywords)=> {
    return new Promise((resolve,reject)=>{
        const { spawn } = require('child_process')
        const pyProg = spawn('py', ['public_static/python/processing.py', keywords])
        console.log(":i");
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

const userSave = (mail, query) => {
    console.log(mail);
    return new Promise((resolve, reject) => {
        models.User.findOne({ email: mail })
        .then(student => {
            student.pastQueries.push(query);
            return student.save();
        })
        .then(student => {
            console.log("Successfully Saved student");
            resolve(student);
        })
        .catch(err => {
            console.log("Error in student updating");
            console.log(err);
            reject(err);
        });
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
        console.log(`Keywords: ${keywords}`)
        console.log(req.body);
        query.email = req.body.studentEmail
        query.email.push(req.body.selfEmail)
        query.user = req.user._id
        query.dateUploaded = Date.now()

        console.log("1");
        
        query.save()
        .then(query => {
            return queryProcess(newKeywords, query);
        })
        .then(text => {
            console.log(`email: ${text}`)
            console.log("2");
            return models.User.findById(req.user.id);
        })
        .then(user=> {
            console.log(user);
            user.pastQueries.push(query);
            return user.save();
        })
        .then(user=>{
            console.log("Save h");
            let promises = [];
            mails = req.body.studentEmail
            for(let i=0 ; i<mails.length ; i++) {
                promises.push(userSave(mails[i], query));
            }
            console.log("pakk")
            return Promise.all(promises);
        })
        .then(() => {
            //req.flash('homePgSuccess', 'Successfully submitted the query.');
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
});

module.exports = route;
