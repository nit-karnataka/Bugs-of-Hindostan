const mongoose = require('mongoose');

const querySchema = mongoose.Schema({
    keywords: [String],
    email: [String], // in case of multiple emails as in student
    dateUploaded: Date,
    lastUpdated: {
        type: Date,
        default: 100000000
    },
    pdfsProcessed: {
        type: Number, 
        default: 0
    }, 
    result: {
        type: String,
        default: ""
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model('Query', querySchema);