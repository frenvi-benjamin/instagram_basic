const mongoose = require("mongoose")
const Schema = mongoose.Schema

const qrcodeSchema = new Schema({
    connectedUser: String
}, { timestamps: true })

const QrCode = mongoose.model("QrCode", qrcodeSchema)

module.exports = QrCode