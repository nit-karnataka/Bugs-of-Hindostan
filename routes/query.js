const route = require('express').Router();
const models = require('../models');
const auth = require('../utils/auth');
const trieFuntions = require('../utils/trieFunctions')

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

const confidence = (trie,newKeywords) => {
    let total = newKeywords.length
    let matched = 0
    newKeywords.forEach(keyword => {
        console.log(keyword)
        if (trieFuntions.isWord(trie.root,keyword)){
            console.log('found')
            matched++
        }
    })
    let confi = (matched*1.0)/(total)
    return confi
}

const queryProcess = (keywords) => {
    return new Promise((resolve, reject)=>{
        models.Pdf.find()
        .then(pdfs => {
            threshold = 0.66 // 4/6
            text = ""   //text to be emailed
            pdfs.forEach(pdf =>{
                console.log(pdf.pdfUrl)
                console.log(`Pdf name- ${pdf.name}`)
                score = confidence(pdf.trie,keywords)
                console.log(`score: ${score}`)
                if (score > threshold){
                    console.log('selected')
                    text = text + ' ' + pdf.pdfUrl
                }
            })
            console.log(text)
            resolve(text)
        })
        .catch(err => {
            console.log(`error: ${err}`)
            reject(err);
        })
    })
}

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
            user.pastQueries.push(query);
            return user.save();
        })      
        .then(user=>{
            return processKeywords(query.keywords);
        })
        .then( newKeywords => {
            return queryProcess(newKeywords)
        })
        .then(text => {
            console.log(`email: ${text}`)
            return
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
