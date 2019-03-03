let mwo = {}; //middleware object

mwo.isLoggedIn = (req,res,next)=> {
    if(req.isAuthenticated())
        return next();
    req.flash('loginMsg','You need to be logged in first');
    res.redirect('/login');
}

mwo.isStudent = (req, res, next) => {
    if(req.isAuthenticated()) {
        console.log(req.user);
        next();
    }
    req.flash('loginMsg', 'You need to be logged in first');
}

module.exports = mwo;