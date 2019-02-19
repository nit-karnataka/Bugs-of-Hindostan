const mongoose = require('mongoose');

const querySchema = mongoose.Schema({
    keywords: [String],
    email: [String], // in case of multiple emails as in student
    dateUploaded: Date, 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model('Query', querySchema);