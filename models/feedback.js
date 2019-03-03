const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema({
    text: String,
    dateUploaded: {
        type: Date,
        default: Date.now()
    }, 
    qid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Query'
    },
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Feedback', feedbackSchema);