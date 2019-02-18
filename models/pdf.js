const mongoose = require('mongoose');

const pdfSchema = mongoose.Schema({
    name: String,
    dateUploaded: Date, 
    trie: mongoose.Schema.Types.Mixed,
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pdfUrl: String
});

module.exports = mongoose.model('Pdf', pdfSchema);