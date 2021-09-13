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
    nrOfScans: {
        default: 0,
        type: Number
    },
    scans: [Date],
    promotedPost: String,
    rewardType: {
        default: 4,
        type: Number
    },
    public: {
        default: false,
        type: Boolean
    },
}, { timestamps: true })

const User = mongoose.model("User", userSchema)

module.exports = User