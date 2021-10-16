const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')

router.get('/register', (req, res) => {
    res.render('users/register')
})
router.post('/register', catchAsync(async (req, res) => {
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
}))
router.get('/login', (req, res) => {
    res.render('users/login')
})
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', 'Welcome back')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
})
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success', 'goodbye')
    res.redirect('/login')
})

module.exports = router