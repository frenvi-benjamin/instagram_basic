const QrCode = require("../models/qrcode")
const User = require("../models/user")
const instagramHelper = require("./instagram-helper")


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
        instagramHelper.getUsername(accessToken),
        instagramHelper.getID(accessToken),
        instagramHelper.getShortcode(accessToken),
    ])
    .then(res => {console.log(res); return res})
    .then(([username, id, shortcode]) => {
        return User.findOneAndUpdate({ instagramUserID: id }, { username: username, accessToken: accessToken, shortcode: shortcode, qrcodes: [], nrOfScans: 0 }, { upsert: true })
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
    return User.findOne({ username: username }).exec()
}

function updateShortcode(accessToken) {
    return instagramHelper.getShortcode(accessToken)
    .then(shortcode => {
        return User.findOneAndUpdate({ accessToken: accessToken }, { shortcode: shortcode }, { upsert: true }).exec()
    })
}

module.exports = { clearConnections, getConnectedUser, createUserFromAccessToken, connectQrcodeToUser, createQrcodes, deleteAllQrcodes, incrementNrOfScans, getUserByUsername, updateShortcode }