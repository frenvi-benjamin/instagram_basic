const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    instagramUserID: {
        type: String,
        required: true,
        unique: true
    },
    accessToken: String,
    username: String,
    shortcode: String,
    qrcodes: [{
        type: Schema.Types.ObjectId,
        ref: "QrCode"
    }],
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User