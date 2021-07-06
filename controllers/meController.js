const User = require("../models/userModel")

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

module.exports = { get, set }