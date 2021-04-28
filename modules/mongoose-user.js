const mongoose = require('mongoose')
const User = require('../models/user')
const qrcodeHelper = require('./mongoose-qrcode')

function allUsers() {
    return User.find()
}

function getUserByID(userID) {
    return User.findOne({"_id": userID})
}

function getUserByFacebookPageID(facebookPageID) {
    return User.findOne({"facebookPageID": facebookPageID})
}

function getUserByInstagramUserID(instagramUserID) {
    return User.findOne({"instagramUserID": instagramUserID})
}

module.exports = { allUsers, getUserByID, getUserByFacebookPageID, getUserByInstagramUserID }