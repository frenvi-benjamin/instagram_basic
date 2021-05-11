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
    return fetch(userURL + `?fields=username&access_token=${accessToken}`)
    .then(response => {return response.json()})
    .then(response => {return response.username})
}

function getShortcodeForLatestPost(accessToken) {
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
    return fetch(userURL + `?access_token=${accessToken}`)
    .then(response => {return response.json()})
    .then(response => {return response.id})
}

function getOembed(username) {
    return getUserByUsername(username)
    .then(user => getShortcodeForLatestPost(user.accessToken))
    .then(shortcode => fetch(oembedURL + `?url=https://www.instagram.com/p/${shortcode}&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`))
    .then(response => response.json())
    .then(body => body.html)
}

// DATABASE

function clearConnections(username = undefined) {
    if (username) {
        var promises = []
        User.find({username: username}, "qrcodes").exec()
        .then(qrcodes => {
            qrcodes.forEach(qrID => {
                promises.push(QrCode.findByIdAndUpdate(qrID, { connectedUser: undefined }))
            })
            promises.push(User.findOneAndUpdate({ username: username }, { qrcodes: [] }))
            Promise.all(promises)
        })
        
    }
    else {
        Promise.all([
            QrCode.updateMany({}, { connectedUser: undefined }),
            User.updateMany({}, { qrcodes: [] })
        ])
    }
}

function getConnectedUser(qrID) {
    return QrCode.findById(qrID, "connectedUser")
    .then(qrcode => {
        if (qrcode.connectedUser) {
            return User.findOne({ instagramUserID: qrcode.connectedUser })
            .then(res => {return res})
        }
        else {
            reject()
        }
    })
}

function createUserFromAccessToken(accessToken) {
    return Promise.all([
        getUsername(accessToken),
        getID(accessToken),
        getShortcodeForLatestPost(accessToken),
    ])
    .then(res => {console.log(res); return res})
    .then(([username, id, shortcode]) => {
        return User.findOneAndUpdate({ instagramUserID: id }, { username: username.toLowerCase(), accessToken: accessToken, shortcode: shortcode, qrcodes: [], nrOfScans: 0 }, { upsert: true })
    })
}

function connectQrcodeToUser(qrID, instagramUserID) {
    
    return Promise.all([
        QrCode.findByIdAndUpdate(qrID, { connectedUser: instagramUserID }, { upsert: true }),
        User.findOneAndUpdate({ instagramUserID: instagramUserID }, { $addToSet: { qrcodes: qrID }})
    ])
}

function createQrcodes(n) {
    let array = []
    for (let i = 0; i < n; i++) {
        array.push({ connectedUser: undefined})
    }
    return QrCode.insertMany(array)
}

function deleteAllQrcodes() {
    QrCode.deleteMany({}).exec()
}

function incrementNrOfScans(username) {
    User.findOneAndUpdate({ username: username }, { $inc: { nrOfScans: 1 }}, { upsert: true }).exec()
}

function getUserByUsername(username) {
    return User.findOne({ username: username.toLowerCase() }).exec()
}

function updateShortcode(accessToken) {
    return getShortcodeForLatestPost(accessToken)
    .then(shortcode => {
        return User.findOneAndUpdate({ accessToken: accessToken }, { shortcode: shortcode }, { upsert: true }).exec()
    })
}

function deleteUser(username, deleteQrcodes = false) {
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
    getConnectedUser,
    createUserFromAccessToken,
    connectQrcodeToUser,
    createQrcodes,
    deleteAllQrcodes,
    incrementNrOfScans,
    getUserByUsername,
    updateShortcode,
    deleteUser,
    getShortcodeForLatestPost,
    getUsername,
    getID,
    getOembed
}