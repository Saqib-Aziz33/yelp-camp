const express = require(`express`)
const app = express()
const path = require(`path`)
const mongoose = require(`mongoose`)
const methodOverride = require(`method-override`)
const expressLayouts = require(`express-ejs-layouts`)
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const localStrategy = require('passport-local')
//files
const ExpressError = require('./utils/ExpressError')
const campgroundRoutes = require('./routes/campground')
const reviewsRoutes = require('./routes/reviews')
const userRoutes = require('./routes/user')
const User = require('./models/user')



//connection
mongoose.connect(`mongodb://localhost:27017/yelp-camp`, {
    useNewUrlParser: true,
    //useCreateIndex: true, option not supported
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on(`error`, console.error.bind(console, `connection error: `))
db.once(`open`, () => {
    console.log(`database connected`)
})


//views and public and middlewares
//app.engine(`ejs`, ejsMate); this package is not working correctly alternate ejs-express-layouts
app.set(`view engine`, `ejs`)
app.set(`views`, path.join(__dirname, `views`))
app.set(`layout`, `layouts/layout`)
app.use(expressLayouts)
app.use(express.static(path.join(__dirname, `public`)))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(methodOverride(`_method`))
const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())
//passport middlewares
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//to use variables globally
app.use((req, res, next) => {
    //console.log(req.originalUrl)
    //console.log(req.session)
    if(!['/login', '/'].includes(req.originalUrl)){
        req.session.returnTo = req.originalUrl
    }
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})



//routing
app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)

app.get('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404))
})
//error handler
app.use((err, req, res, next) => {
    const {statusCode = 500} = err
    if(!err.message){
        err.message = 'Something went wrong'
    }
    res.status(statusCode).render('error', {err})
})

app.listen(3000, () => {
    console.log(`running at http://localhost:3000`)
})