const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const models = require("./models");

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    models.User.findById(id) 
    .then((user) => {
        done(null, user);
    })
    .catch((err) => {
        done(err);
    });
});


const localStrategy = new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, email, password, done) => {
    models.User.findOne( { email } )
    .then((user)=>{
        if(!user)
            return done(null, false, req.flash('loginMsg','User does not exists!'));
        if(!user.comparePassword(password)) 
            return done(null, false, req.flash('loginMsg','Password Incorrect!'));
        return done(null, user, req.flash('homePgMsg', `Welcome, ${user.name}!`));
    })
    .catch((err)=>{
        done(err);
    });
});

exports.isAuthenticated = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

passport.use('local', localStrategy);

module.exports = passport;