const QrCode = require('../models/qrcode')
const User = require('../models/user')
const instagramHelper = require('./instagram-helper')


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
            return undefined
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
        return User.findOneAndUpdate({ instagramUserID: id }, { username: username, accessToken: accessToken, shortcode: shortcode, qrcodes: [] }, { upsert: true })
    })
}

function connectQrcodeToUser(qrID, instagramUserID) {
    
    return Promise.all([
        QrCode.findByIdAndUpdate(qrID, { connectedUser: instagramUserID }, { upsert: true }),
        User.findOneAndUpdate({ instagramUserID: instagramUserID }, { $addToSet: { qrcodes: qrID }})
    ])
}


module.exports = { clearConnections, getConnectedUser, createUserFromAccessToken, connectQrcodeToUser }