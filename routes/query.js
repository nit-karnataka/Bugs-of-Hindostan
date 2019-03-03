const route = require('express').Router();
const models = require('../models');
const auth = require('../utils/auth');
const queryProcess = require('../utils/query');

const processKeywords = (keywords)=> {
    return new Promise((resolve,reject)=>{
        const { spawn } = require('child_process')
        const pyProg = spawn('python', ['public_static/python/processing.py', keywords])
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
            console.log(student);
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
        console.log("11");
        let query = new models.Query()
        query.keywords = keywords
        console.log(`Keywords: ${keywords}`)
        console.log(req.body);
        let emails = []
        let studentsData = req.body.studentEmail
        studentsData.forEach(studentData => {
            studentData = studentData.split(';');
            emails.push(studentData[0]);
            query.students.push(studentData[1]);
            query.phoneNos.push(studentData[2]);
        }) 
        let mentorData = req.body.mentorEmail.split(';');
        console.log(mentorData);
        emails.push(mentorData[0]);
        query.mentor = mentorData[1]; 
        query.phoneNos.push(mentorData[2]);
        query.email = emails
        // query.email = req.body.studentEmail
        query.user = req.user._id
        query.dateUploaded = Date.now()

        console.log("22");
        console.log(query);

        console.log("1");
        
        query.save()
        .then(query => {
            return queryProcess(newKeywords, query);
        })
        .then(text => {
            console.log(`email: ${text}`)
            console.log("2");
            console.log(req.user);
            return models.User.findById(req.user.id);
        })
        .then(user=> {
            console.log(user);
            user.pastQueries.push(query);
            console.log("Pushed");
            return user.save();
        })
        .then(user=>{
            console.log("Save h");
            let promises = [];
            for(let i=0 ; i<studentsData.length ; i++) {
                console.log(studentsData[i].split(';')[0]);
                promises.push(userSave(studentsData[i].split(';')[0], query));
            }
            promises.push(userSave(mentorData[0], query));
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
