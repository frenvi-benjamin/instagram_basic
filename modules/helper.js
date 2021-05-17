require("dotenv").config()

// database models
const QrCode = require("../models/qrcode")
const User = require("../models/user")

// fetch
const fetch = require("node-fetch")

// api urls
const mediaURL = "https://graph.instagram.com/me/media"
const userURL = "https://graph.instagram.com/me"
const oembedURL = "https://graph.facebook.com/v10.0/instagram_oembed"

// INSTAGRAM

function getUsername(accessToken) {

    if (!accessToken) return new Promise.reject()

    return fetch(userURL + `?fields=username&access_token=${accessToken}`)
    .then(response => {return response.json()})
    .then(response => {return response.username})
}

function getShortcodeForLatestPost(accessToken) {

    if (!accessToken) return new Promise.reject()

    return fetch(mediaURL + `?fields=permalink&access_token=${accessToken}`)
    .then(res => res.json())
    .then(body => {
        const link = body.data[0].permalink
        // find shortcode
        const pos = link.search("/p/") + 3
        return link.slice(pos, -1)
    })
}

function getID(accessToken) {

    if (!accessToken) return new Promise.reject()

    return fetch(userURL + `?access_token=${accessToken}`)
    .then(response => {return response.json()})
    .then(response => {return response.id})
}

function getOembed(username) {

    if (!username) return new Promise.reject()

    return getUserByUsername(username)
    .then(user => getShortcodeForLatestPost(user.accessToken))
    .then(shortcode => fetch(oembedURL + `?url=https://www.instagram.com/p/${shortcode}&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`))
    .then(response => response.json())
    .then(body => body.html)
}

// DATABASE

function deleteQrcodes(username = undefined) {
    if (username) {
        return User.findOne({username: username}).exec()
        .then(user => {
            if (!user) this.reject()
        })
        .then(qrcodes => QrCode.deleteMany({ _id: { $in: qrcodes }}).exec())
        .then(User.findOneAndUpdate({ username: username }, { qrcodes: [] }).exec())
    }
    else {
        return Promise.all([
            QrCode.deleteMany({}).exec(),
            User.updateMany({}, { qrcodes: [] }).exec()
        ])
        
    }
}

function clearConnections(username = undefined) {
    if (username) {
        return User.findOne({username: username}).exec()
        .then(user => {
            if (!user) this.reject()
            else return user.qrcodes
        })
        .then(qrcodes => {
            QrCode.updateMany({ _id: { $in: qrcodes }}, { connectedUser: undefined }).exec()
            User.findOneAndUpdate({ username: username }, { qrcodes: [] }).exec()
        })
    }
    else {
        return Promise.all([
            QrCode.updateMany({}, { connectedUser: undefined }).exec(),
            User.updateMany({}, { qrcodes: [] }).exec()
        ])
        
    }
}

function getConnectedUser(qrID) {
    return QrCode.findById(qrID)
    .then(qrcode => {
        if (!qrcode) return new Promise.reject()
        return qrcode.connectedUser
    })
    .then(instagramUserID => {
        if (instagramUserID) {
            return User.findOne({ instagramUserID: instagramUserID })
            .then(user => {return user})
        }
        else {
            reject()
        }
    })
}

function createUserFromAccessToken(accessToken) {

    if (!accessToken) return new Promise.reject()

    return Promise.all([
        getUsername(accessToken),
        getID(accessToken),
        getShortcodeForLatestPost(accessToken),
    ])
    .then(([username, id, shortcode]) => {
        return User.findOneAndUpdate({ instagramUserID: id }, { username: username, accessToken: accessToken, shortcode: shortcode, qrcodes: [], nrOfScans: 0 }, { upsert: true })
    })
}

function connectQrcodeToUser(qrID, instagramUserID) {

    if (!qrID || !instagramUserID) return new Promise.reject()
    
    QrCode.findByIdAndUpdate(qrID, { connectedUser: instagramUserID }, { upsert: true }).exec()
    User.findOneAndUpdate({ instagramUserID: instagramUserID }, { $addToSet: { qrcodes: qrID }}).exec()
}

function createQrcodes(n) {

    if (!n) return new Promise.reject()

    let array = []
    for (let i = 0; i < n; i++) {
        array.push({ connectedUser: undefined})
    }
    return QrCode.insertMany(array)
}

function incrementNrOfScans(username) {

    if (!username) return new Promise.reject()

    User.findOneAndUpdate({ username: username }, { $inc: { nrOfScans: 1 }}, { upsert: true }).exec()
}

function getUserByUsername(username) {

    if (!username) return new Promise.reject()

    return User.findOne({ username: {$regex: new RegExp(username.toLowerCase(), "i")} }).exec()
}

function updateShortcode(accessToken) {

    if (!accessToken) return new Promise.reject()

    return getShortcodeForLatestPost(accessToken)
    .then(shortcode => {
        return User.findOneAndUpdate({ accessToken: accessToken }, { shortcode: shortcode }, { upsert: true }).exec()
    })
}

function deleteUser(username, deleteQrcodes = false) {

    if(!username) return new Promise.reject()

    if (deleteQrcodes) {
        User.findOne({ username: username})
        .then(user => {
            user.qrcodes.forEach(qrcode => {
                QrCode.findByIdAndDelete(qrcode).exec()
            });
        })
    }

    User.findOneAndDelete({ username: username }).exec()
    
}

module.exports = {
    clearConnections,
    deleteQrcodes,
    getConnectedUser,
    createUserFromAccessToken,
    connectQrcodeToUser,
    createQrcodes,
    incrementNrOfScans,
    getUserByUsername,
    updateShortcode,
    deleteUser,
    getShortcodeForLatestPost,
    getUsername,
    getID,
    getOembed
}