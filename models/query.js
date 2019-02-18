const mongoose = require('mongoose');

const querySchema = mongoose.Schema({
    keywords: [String],
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teacher"
    },
    studentOrTeacher: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Query', querySchema);

