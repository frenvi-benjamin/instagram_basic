const mongoose = require('mongoose')
const { find } = require('../models/qrcode')
const QrCode = require('../models/qrcode')
const userHelper = require('./mongoose-user')


function allQrCodes() {
    return QrCode.find()
}

function getQrcodeByID(qrID) {
    return QrCode.findOne({"_id": qrID}).then((qrcode) => {return qrcode})
}

function getConnectedUser(qrID) {
    return getQrcodeByID(qrID)
    .then((qrcode) => {
        if (qrcode.connectedUser) {
            return userHelper.getUserByID(qrcode.connectedUser)
            .then((user) => {return user})
        }
        else {
            return null
        }
        
    })
}

function clearConnectedUsers() {
    QrCode.updateMany({}, { connectedUser: undefined})
}

module.exports = { allQrCodes, getQrcodeByID, getConnectedUser, clearConnectedUsers }