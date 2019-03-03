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

const clinicalKeyOutput = (text) => {
    return new Promise((resolve,reject)=>{
        console.log(`inside: ${text}`)
        const { spawn } = require('child_process');
        const pyProg = spawn('py', ['public_static/python/clinicalKey.py', text]);  
        pyProg.stdout.on('data', (data) => {
            data = data.toString();
            resolve(data);
        });
    
        pyProg.stderr.on('data', (err) => {
            console.log('error in clinical key')
            console.log(err.toString());
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
    text = ''
    keywords.forEach(kw => {
        text = text + kw + ','
    });
    clinicalKeyOutput(text)
    .then(result => {
        processKeywords(keywords)
        .then((newKeywords) => {
            let query = new models.Query()
            query.result = result
            query.keywords = keywords
            console.log(`Keywords outside: ${keywords}`)
            query.email = req.body.studentEmail
            query.email.push(req.body.selfEmail)
            query.user = req.user._id
            query.dateUploaded = Date.now()
            
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
                console.log("Saved user");
                let promises = [];
                mails = req.body.studentEmail
                for(let i=0 ; i<mails.length ; i++) {
                    promises.push(userSave(mails[i], query));
                }
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
    })
    .catch(err=> {
        console.log(`err in outermost query level: ${err}`)
        return res.redirect('/')
    })
});

module.exports = route;
