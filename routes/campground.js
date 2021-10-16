const express = require('express')
const router = express.Router()
const Campground = require(`../models/campground`)
const {campgroundSchema} = require('../schemas')
const catchAsync = require(`../utils/catchAsync`)
const ExpressError = require('../utils/ExpressError')
const {isLoggedIn} = require('../middleware')

//data validation using joi
const validateCampground = (req, res ,next) => {
    const {error} = campgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else{
        next()
    }
}

router.get(`/`, catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render(`campgrounds/index`, {campgrounds})
}))
//creat
router.get('/new', isLoggedIn, (req, res) => {
    res.render(`campgrounds/new`)
})
router.post(`/`, isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    //if(!req.body.campground){throw new ExpressError('Some field are empty', 400)}
    
    const campground = new Campground(req.body.campground)
    await campground.save()
    req.flash('success', 'Successfully created')
    res.redirect(`/campgrounds/${campground._id}`)
}))
//read
router.get(`/:id`, isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews')
    if(!campground){
        req.flash('error', 'campground not found')
        return res.redirect('/campgrounds')
    }
    res.render(`campgrounds/show`, {campground})
}))
//edit
router.get(`/:id/edit`, isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if(!campground){
        req.flash('error', 'campground not found')
        return res.redirect('/campgrounds')
    }
    res.render(`campgrounds/edit`, {campground})
}))
router.put(`/:id`, isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', 'Successfully updated')
    res.redirect(`/campgrounds/${campground.id}`)
}))
//delete
router.delete(`/:id`, isLoggedIn, catchAsync(async (req, res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted')
    res.redirect(`/campgrounds`)
}))

module.exports = router;