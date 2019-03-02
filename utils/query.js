const trieFuntions = require('../utils/trieFunctions')
const models = require('../models');

const confidence = (trie,newKeywords) => {
    let total = newKeywords.length
    let matched = 0
    newKeywords.forEach(keyword => {
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
                score = confidence(pdf.trie,keywords)
                if (score > threshold){
                    text = text + ' ' + pdf.pdfUrl
                }
            })
            query.pdfsProcessed += pdfs.length 
            query.result += text
            query.lastUpdated = Date.now()
            query.save()
            .then(q => {
                resolve(text);
            })
            .catch(err => {
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