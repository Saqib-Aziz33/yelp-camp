const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const users = require('../controllers/users')

//index page
router.get('/', (req, res) => {
    res.render('index')
})

//user registration
router.route('/register')
    .get(users.renderRegister) //render a reg form
    .post(catchAsync(users.register)) //register a user

//user login
router.route('/login')
    .get(users.renderLogin) //render a login form
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login) //login a user

//logout a user
router.get('/logout', users.logout)

module.exports = router