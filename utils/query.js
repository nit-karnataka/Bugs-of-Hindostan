const trieFuntions = require('../utils/trieFunctions')
const models = require('../models');
const nodemailer = require('nodemailer');
const config = require('../config2');

const confidence = (trie,newKeywords) => {
    let total = newKeywords.length
    let matched = 0
    l = Object.keys(newKeywords).length
    for( i=0 ;i<l; i++){
        f = 1
        keyword = newKeywords[i].split(' ')
        keyword.forEach(single => {
            if(single.length > 0){
                if (trieFuntions.isWord(trie.root,single)){}
                else{
                    f = 0
                }
            }
        })
        if(f == 1){
            matched++
        }
    }
    let confi = (matched*1.0)/(total)
    return confi
}

const textMessage = (query) => {
    return new Promise ((resolve, reject)=>{
        models.User
        .findById(query.user)
        .then(user=> {
            const { spawn } = require('child_process');
            phoneNo = user.phoneNo
            const pyProg = spawn('py', ['public_static/python/msg.py', phoneNo]);  
            pyProg.stdout.on('data', (data) => {
                data = data.toString();
                console.log('yaha text msg')
                console.log(data)
                resolve();
            });
        
            pyProg.stderr.on('data', (err) => {
                console.log('error in text msg')
                console.log(err.toString());
                reject(err);
            })
        })
        .catch(err=> {
            console.log(err)
            reject(err)
        })
    })
}

const queryProcess = (keywords, query) => {
    return new Promise((resolve, reject)=>{
        models.Pdf.find()
        .skip(query.pdfsProcessed)
        .then(pdfs => {
            threshold = 0.75 // 4/6
            text = ""   //text to be emailed
            pdfs.forEach(pdf =>{
                score = confidence(pdf.trie,keywords)
                if (score > threshold){
                    text = text + '\n' + pdf.pdfUrl
                }
            })
            query.pdfsProcessed += pdfs.length 
            query.lastUpdated = Date.now()
            
            if(text.length == 0) {
                text = "No new Relevant resources were added during last 3 Months"
            }

            finalResult = ''

            arrayOfUrl = query.result.split(' ')

            arrayOfUrl.forEach(single => {
                finalResult = finalResult + '\n' + single 
            })

            string = 'Here are the results to your query.\n' +
            `Keywords: ${query.keywords}\n` + 
            `Following are the relevant article from ClinicalKey Website: \n` +
            finalResult + `\n` +
            'Following are the relevant articles extracted from Local Database: \n' + text

            query.result += text
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
                .then(()=>{
                    console.log('time to text')
                    return textMessage(query)
                })
                .catch(err => {
                    console.log(err);
                    console.log("Mail not sent");
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