const QrCode = require('../models/qrcode')
const User = require('../models/user')
const instagramHelper = require('./instagram-helper')


function clearConnections(username = undefined) {
    if (username) {
        const qrcodes = User.find({username: username}, "qrcodes")
        var promises = []
        qrcodes.forEach(qrID => {
            promises.push(QrCode.findOneAndUpdate({ _id: qrID }, { connectedUser: undefined }))
        })
        promises.push(User.findOneAndUpdate({ username: username }, { qrcodes: [] }))
        Promise.all(promises)
    }
    else {
        Promise.all([
            QrCode.updateMany({}, { connectedUser: undefined }),
            User.updateMany({}, { qrcodes: [] })
        ])
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
    .then(res => {console.log(res); return res})
    .then(([username, id, shortcode]) => {
        return User.findOneAndUpdate({ instagramUserID: id }, { username: username, accessToken: accessToken, shortcode: shortcode }, { upsert: true })
    })
}

function getUserByID(userID) {
    return Promise.all([User.findOne({"_id": userID})])
}

module.exports = { clearConnections, getConnectedUser, createUserFromAccessToken, getUserByID }