const mongoose = require('mongoose');

const pdfSchema = mongoose.Schema({
    name: String,
    dateUploaded: Date, 
    trie: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Pdf', pdfSchema);