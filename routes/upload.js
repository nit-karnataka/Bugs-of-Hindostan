const route = require('express').Router();
const models = require('../models');
const { upload, cloudinary } = require("../utils/pdfs");
const trieFunctions = require('../utils/trieFunctions');
const Trie = require('../utils/Trie');

const getWords = (filePath) => {
    return new Promise((resolve, reject) => {
        const { spawn } = require('child_process');
        const pyProg = spawn('python', ['public_static/python/get2.py', filePath]);  
        //console.log('yaha0')
        pyProg.stdout.on('data', (data) => {
            data = data.toString();
            //console.log('yaha')
            data = data.split(' ');
            // data = data.splice(3);
            // console.log(data);
            // data = data[0];
            // console.log(data);
            // data = data.split('\', \'');
            // console.log('yaha2')
            // console.log(data)
            // data[0] = data[0].substr(2);
            // data[data.length-1] = data[data.length-1].substr(0,data[data.length-1].length-4);
            // console.log('yaha3')
            // console.log(data)
            resolve(data);
        });
    
        pyProg.stderr.on('data', (err) => {
            console.log('Error in python')
            console.log(err.toString());
            reject(err);
        })
    });
}

const constructTrie = (filePath) => {
    filePath = 'public_static/uploads/' + filePath + '.pdf';
    //console.log("Trie tak")
    return new Promise((resolve, reject) => {
        getWords(filePath)
        .then(data => {
            myTrie = new Trie();
            data.forEach(word => {
                trieFunctions.add(myTrie.root, word);
            });
            resolve(myTrie);
        })
        .catch(err => {
            console.log("Error: ");
            console.log(err.toString())
            reject(err);
        })
    })
};

const uploadPdfAndProcessPdf = function (req) {
    return new Promise((resolve, reject) => {
        if(req.file) {
            async function processPdf() {
                try {
                    const result = await cloudinary.uploader.upload(req.file.path);
                    const mtrie = await constructTrie(result.original_filename);
                    const pdf = await models.Pdf.create({
                        name: req.body.name,
                        dateUploaded: Date.now(),
                        uploadedBy: req.user._id,
                        pdfUrl: result.url,
                        trie: mtrie
                    });
                    console.log("Pdf made");
                    resolve(pdf);
                } catch(err) {
                    console.log("Error while upload: ");
                    console.log(err)
                    reject(err);
                }
            }
            processPdf();
        }
        else {
            reject(new Error('No files selected'));
        }
    });
} 

route.post('/', upload.single('pdf'), (req, res) => {
    uploadPdfAndProcessPdf(req) 
    .then(pdf => {
        console.log(`pdf saved: ${pdf.name}`)
        //console.log(pdf);
    })
    .catch(err => {
        console.log(err);
    })
    res.redirect('/');
});

route.get('/', (req, res) => {
    res.render('upload');
});

module.exports = route;