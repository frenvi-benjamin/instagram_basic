const User = require("../models/userModel")
const QrCode = require("../models/qrcodeModel")

function get(req, res) {
    User.findOne({ instagramUserID: req.session.instagramUserID })
    .exec((err, user) => {
        if (err) res.send(err)
        else res.send(user)
    })
}

function set(req, res) {
    User.findOneAndUpdate({ instagramUserID: req.session.instagramUserID }, req.body)
    .exec((err, user) => {
        if (err) res.send(err)
        else res.send(user)
    })
}

function connect(req, res) {
    Promise.all([
        QrCode.findByIdAndUpdate(req.body.qrID, { connectedUser: req.session.instagramUserID }, { upsert: true }),
        User.findOneAndUpdate({ instagramUserID: req.session.instagramUserID }, { $addToSet: { qrcodes: req.body.qrID }})
    ])
    .then(response => res.send(response))
}

module.exports = { get, set, connect }