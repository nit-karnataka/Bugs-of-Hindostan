const trieFuntions = require('../utils/trieFunctions')
const models = require('../models');
const nodemailer = require('nodemailer');
const config = require('../config');

const confidence = (trie,newKeywords) => {
    let total = newKeywords.length
    let matched = 0
    console.log('confi ke keywords')
    console.log(keywords)
    console.log(typeof keywords)
    l = Object.keys(keywords).length
    console.log(l)
    for( i=0 ;i<l; i++){
        f = 1
        keyword = keywords[i].split(' ')
        console.log(keyword)
        keyword.forEach(single => {
            console.log(single.length)
            if(single.length > 0){
                console.log(single)
                if (trieFuntions.isWord(trie.root,single)){}
                else{
                    f = 0
                }
            }
        })
        if(f == 1){
            console.log("matched")
            matched++
        }
        else{
            console.log("didn't match")
        }
    }
    newKeywords.forEach(keyword => {
        console.log(keyword)
        if (trieFuntions.isWord(trie.root,keyword)){
            matched++
        }
    })
    let confi = (matched*1.0)/(total)
    return confi
}

const queryProcess = (keywords, query) => {
    return new Promise((resolve, reject)=>{
        models.Pdf.find()
        .skip(query.pdfsProcessed)
        .then(pdfs => {
            console.log("PC");
            console.log(pdfs.length);
            threshold = 0.66 // 4/6
            text = ""   //text to be emailed
            pdfs.forEach(pdf =>{
                console.log(`pdf name: ${pdf.name}`)
                score = confidence(pdf.trie,keywords)
                if (score > threshold){
                    text = text + '\n' + pdf.pdfUrl
                }
            })
            query.pdfsProcessed += pdfs.length 
            query.result += text
            query.lastUpdated = Date.now()
            
            if(text.length == 0) {
                text = "No new Relevant resources were added during last 3 Months"
            }

            string = 'Here are the results to your query.\n' +
            `Keywords: ${query.keywords}\n` + 
            'Following are the relevant articles: \n' + text
            query.save()
            .then(q => {
                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: config.MAILER.EMAIL,
                        pass: config.MAILER.PASSWORD
                    }
                });

                const mailOptions = {
                    to: q.email,
                    from: config.MAILER.EMAIL,
                    subject: 'Eureka: Results to your Query',
                    text: string
                };

                transporter.sendMail(mailOptions)
                .then(()=>{
                    console.log('Mail Sent!');
                    resolve(text);
                })
                .catch(err => {
                    console.log(err);
                    console.log("Mail nahi gya");
                })
            })
            .catch(err => {
                console.log(err);
                console.log("Error in  Q saving");
            })
        })
        .catch(err => {
            console.log(`error: ${err}`)
            reject(err);
        })
    })
}

module.exports = queryProcess;