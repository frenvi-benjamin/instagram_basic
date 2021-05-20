require("dotenv").config()

// database models
const QrCode = require("../models/qrcodeModel")
const User = require("../models/userModel")

// fetch
const fetch = require("node-fetch")

// api urls
const mediaURL = "https://graph.instagram.com/me/media"
const userURL = "https://graph.instagram.com/me"
const oembedURL = "https://graph.facebook.com/v10.0/instagram_oembed"

// INSTAGRAM

function getPostPermalink(mediaID, accessToken) {
    return fetch(`https://graph.instagram.com/${mediaID}?fields=permalink&access_token=${accessToken}`)
    .then(response => response.json())
    .then(body => body.permalink)
}

function getUsername(accessToken) {

    if (!accessToken) return Promise.reject()

    return fetch(userURL + `?fields=username&access_token=${accessToken}`)
    .then(response => {return response.json()})
    .then(response => {return response.username})
}

function getID(accessToken) {

    if (!accessToken) return Promise.reject()

    return fetch(userURL + `?access_token=${accessToken}`)
    .then(response => {return response.json()})
    .then(response => {return response.id})
}

function getOembed(username) {

    if (!username) return Promise.reject()

    
    return getUser(username)
    .then(user => {
        console.log(JSON.stringify(user.promotedPost))
        if (user.promotedPost) {
            return fetch(oembedURL + `?url=${user.promotedPost}&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`)
            .then(response => response.json())
            .then(body => body.html)
        }
        else {
            return fetch(mediaURL + `?fields=permalink&access_token=${user.accessToken}`)
            .then(response => response.json())
            .then(body => fetch(oembedURL +`?url=${body.data[0].permalink}&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`))
            .then(response => response.json())
            .then(body => body.html)
        }
    })
    
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
        if (!qrcode) return Promise.reject()
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

    if (!accessToken) return Promise.reject()

    return Promise.all([
        getUsername(accessToken),
        getID(accessToken),
    ])
    .then(([username, id]) => {
        return User.findOneAndUpdate({ instagramUserID: id }, { username: username, accessToken: accessToken, qrcodes: [], nrOfScans: 0 }, { upsert: true })
    })
}

function connectQrcodeToUser(qrID, instagramUserID) {

    if (!qrID || !instagramUserID) return Promise.reject()
    
    return Promise.all([
        QrCode.findByIdAndUpdate(qrID, { connectedUser: instagramUserID }, { upsert: true }),
        User.findOneAndUpdate({ instagramUserID: instagramUserID }, { $addToSet: { qrcodes: qrID }})
    ])
}

function createQrcodes(n) {

    if (!n) return Promise.reject()

    let array = []
    for (let i = 0; i < n; i++) {
        array.push({ connectedUser: undefined})
    }
    return QrCode.insertMany(array)
}

function incrementNrOfScans(username) {

    if (!username) return Promise.reject()

    User.findOneAndUpdate({ username: username }, { $inc: { nrOfScans: 1 }}, { upsert: true }).exec()
}

function getUser(username = undefined) {

    if (username) {
        return User.findOne({ username: {$regex: new RegExp(username.toLowerCase(), "i")} })
        .then(user => {
            if (user) return user
            else return Promise.reject()
        })
    }
    else {
        return User.find({}).exec()
    }

}

function deleteUser(username, deleteQrcodes = false) {

    if(!username) return Promise.reject()

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

function refreshAccessTokens() {
    User.find({}, "accessToken")
    .then(users => {
        users.forEach(user => {
            fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${user.accessToken}`)
            .then(response => response.json())
            .then(body => {
                User.findOneAndUpdate({accessToken: user.accessToken}, { accessToken: body.access_token }).exec()
            })
        })
    })
}

module.exports = {
    clearConnections,
    deleteQrcodes,
    getConnectedUser,
    createUserFromAccessToken,
    connectQrcodeToUser,
    createQrcodes,
    incrementNrOfScans,
    getUser,
    deleteUser,
    getUsername,
    getID,
    getOembed,
    refreshAccessTokens,
    getPostPermalink,
}