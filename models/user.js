const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    // facebookPageID: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    instagramUserID: {
        type: String,
        required: true,
        unique: true
    },
    qrcodes: [{
        type: Schema.Types.ObjectId,
        ref: "QrCode"
    }],
    accessToken: String,
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User