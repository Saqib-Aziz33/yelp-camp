const User = require('../models/user')


//render register form
module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

//register user
module.exports.register = async (req, res) => {
    try{
        const {username, email, password} = req.body
        const user = new User({username, email})
        const registerUser = await User.register(user, password)
        req.login(registerUser, err => {
            if(err) {return next(err)}
            req.flash('success', 'Welcome to yelp camp')
            res.redirect('/campgrounds')
        })
    }
    catch(err){
        req.flash('error', err.message)
        res.redirect('/register')
    }
}


module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}


module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back')
    let redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}


module.exports.logout = (req, res) => {
    req.logout()
    req.flash('success', 'goodbye')
    res.redirect('/campgrounds')
}