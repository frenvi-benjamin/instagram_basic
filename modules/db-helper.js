const QrCode = require('../models/qrcode')
const User = require('../models/user')
const fetch = require('node-fetch')


function clearConnections(username = undefined) {
    if (username) {
        const qrcodes = User.find({username: username}, "qrcodes")
        qrcodes.forEach(qrID => {
            QrCode.findOneAndUpdate({ _id: qrID }, { connectedUser: undefined })
        });
        User.findOneAndUpdate({ username: username }, { qrcodes: [] })
    }
    else {
        QrCode.updateMany({}, { connectedUser: undefined })
            User.updateMany({}, { qrcodes: [] })
    }
}

function getConnectedUser(qrID) {
    return QrCode.findOne({ _id: qrID}, "connectedUser")
    .then(qrcode => {
        if (qrcode.connectedUser) {
            return User.findById(qrcode.connectedUser)
            .then(res => {return res})
        }
        else {
            return undefined
        }
    })
}

function createUserFromAccessToken(accessToken) {
    return fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`)
    .then(response => response.json())
    .then(body => {
        console.log("body", body)
        // create or update existing user with new data
        return User.findOneAndUpdate({ instagramUserID: body.id }, { username: body.username, accessToken: accessToken }, { upsert: true })
    })
}

function getUserByID(userID) {
    console.log(userID)
    return Promise.all([User.findOne({"_id": userID})])
}

module.exports = { clearConnections, getConnectedUser, createUserFromAccessToken, getUserByID }