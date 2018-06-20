const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
    email : {type: String, unique: true, lowercase: true},
    password : String, 
    name: String,
    picture: String,
    address: String,
    history: [{
        date: Date,
        paid: {type: Number, default: 0},
    }]
}, {
    usePushEach : true
});

userSchema.pre('save', function(next) {
    var user = this;
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, null, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  });
  
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('user', userSchema); 