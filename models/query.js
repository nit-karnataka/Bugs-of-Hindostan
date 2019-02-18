const mongoose = require('mongoose');

const querySchema = mongoose.Schema({
    keywords: [String],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
});