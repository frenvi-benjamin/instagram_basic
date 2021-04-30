const QrCode = require('../models/qrcode')
const User = require('../models/user')
const instagramHelper = require('./instagram-helper')


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
    Promise.all([
        instagramHelper.getUsername(accessToken),
        instagramHelper.getID(accessToken),
        instagramHelper.getShortcode(accessToken),
    ])
    .then(([username, id, shortcode]) => {
        return User.findOneAndUpdate({ instagramUserID: id }, { username: username, accessToken: accessToken, shortcode: shortcode }, { upsert: true })
    })
}

function getUserByID(userID) {
    return Promise.all([User.findOne({"_id": userID})])
}

module.exports = { clearConnections, getConnectedUser, createUserFromAccessToken, getUserByID }