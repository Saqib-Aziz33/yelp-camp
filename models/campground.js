const mongoose = require(`mongoose`)
const Review = require('./review')
const Schema = mongoose.Schema

const CampgroundSchema = new Schema({
    title: String,
    images: [
        {
            filename: String,
            url: String
        }
    ],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

//delete related reviews too when deleting campground
CampgroundSchema.post('findOneAndDelete', async(doc) => {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model(`campground`, CampgroundSchema)