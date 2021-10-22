const express = require('express')
const router = express.Router()
const catchAsync = require(`../utils/catchAsync`)
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer')
const {storage} = require('../cloudinary/index')
const upload = multer({storage})


router.route('/')
    .get(catchAsync(campgrounds.index)) //get all camps
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground)) //creat a camp

//render form
router.get('/new', campgrounds.renderNewForm)

//operations of single campground
router.route('/:id')
    .get(isLoggedIn, catchAsync(campgrounds.showCampground)) //get a camp
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground)) // update a camp
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)) // delete a camp

//render edit form
router.get(`/:id/edit`, isLoggedIn, catchAsync(campgrounds.renderEditForm))



module.exports = router;