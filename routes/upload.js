const route = require('express').Router();
const models = require('../models');
const { upload, cloudinary } = require("../utils/images");

const constructTrie = function(url) {
    return {};
}

const uploadPdfAndProcessPdf = function (req) {
    if(req.file) {
        return cloudinary.uploader.upload(req.file.path) 
        .then(result => {
            console.log(result);
            fs.unlink(req.file.path);
            return models.Pdf.create({
                name: req.body.name,
                dateUploaded: Date.now(),
                uploadedBy: req.user._id,
                pdfUrl: result.url,
                trie: constructTrie(result.url)
            });
        })
    }
    return new Error('No files selected');
} 

route.post('/', upload.single('pdf'), (req, res) => {
    uploadPdfAndProcessPdf(req) 
    .then(pdf => {
        req.redirect('/success');
    })
    .catch(err => {
        console.log(err);
        res.redirect('/failure');
    })
})

route.get('/', (req, res) => {
    res.render('upload');
})