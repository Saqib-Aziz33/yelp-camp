const Campground = require('../models/campground')
const cloudinary = require('cloudinary')

//all campgrounds
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render(`campgrounds/index`, {campgrounds})
}

//creat form
module.exports.renderNewForm = (req, res) => {
    res.render(`campgrounds/new`)
}

//creat
module.exports.createCampground = async (req, res, next) => {
    //if(!req.body.campground){throw new ExpressError('Some field are empty', 400)}
    const campground = new Campground(req.body.campground)
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.author = req.user._id
    await campground.save()
    //console.log(campground)
    req.flash('success', 'Successfully created')
    res.redirect(`/campgrounds/${campground._id}`)
}

//show campground
module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if(!campground){
        req.flash('error', 'campground not found')
        return res.redirect('/campgrounds')
    }
    res.render(`campgrounds/show`, {campground})
}

//show edit form
module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if(!campground){
        req.flash('error', 'campground not found')
        return res.redirect('/campgrounds')
    }
    res.render(`campgrounds/edit`, {campground})
}

//update campground
module.exports.updateCampground = async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.images.push(...imgs)
    await campground.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}} })
    }
    req.flash('success', 'Successfully updated')
    res.redirect(`/campgrounds/${campground.id}`)
}


//delete campground
module.exports.deleteCampground = async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    for(let img of campground.images){
        //to delete images from cloud also
        await cloudinary.uploader.destroy(img.filename)
    }
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted')
    res.redirect(`/campgrounds`)
}