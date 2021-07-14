const mongoose = require("mongoose")
const Schema = mongoose.Schema

const sessionModel = new Schema({
    _id: String,
    expires: Date,
    session: String
})

const Session = mongoose.model("Session", sessionModel)

module.exports = Session