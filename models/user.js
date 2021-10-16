const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMosgoose = require('passport-local-mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

userSchema.plugin(passportLocalMosgoose)

module.exports = new mongoose.model('User', userSchema)