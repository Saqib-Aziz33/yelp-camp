const Review = require('../models/review')
const Campground = require(`../models/campground`)



module.exports.creatReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    review.author = req.user._id
    await campground.save()
    await review.save()
    req.flash('success', 'review created')
    res.redirect(`/campgrounds/${campground._id}`)
}


module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'review deleted')
    res.redirect(`/campgrounds/${id}`)
}