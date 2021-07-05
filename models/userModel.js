const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    instagramUserID: {
        type: String,
        required: true,
        unique: true
    },
    accessToken: String,
    username: String,
    qrcodes: [{
        type: Schema.Types.ObjectId,
        ref: "QrCode"
    }],
    nrOfScans: Number,
    promotedPost: String,
    rewardType: Number,
}, { timestamps: true })

const User = mongoose.model("User", userSchema)

module.exports = User