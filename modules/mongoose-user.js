const mongoose = require('mongoose')
const fetch = require('node-fetch')
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

function setInstagramAccessToken(accessToken) {
    return fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`)
    .then(response => response.json())
    .then(body => {
        console.log(body)
        const instagramUserID = body.id
        return userHelper.getUserByInstagramUserID(instagramUserID)
    })
    .then(user => {
        if (user) {
            user.accessToken = accessToken
        }
        else {
            user = new User({
                instagramUserID: body.id,
                accessToken: accessToken
            })
        }
        user.save()
        return user
    })
}

module.exports = { allUsers, getUserByID, getUserByFacebookPageID, getUserByInstagramUserID, setInstagramAccessToken }