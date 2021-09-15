/*

Controller for the me route ( /routes/meRoute.js )

Responsible for

- getting and setting any attributes of the current session user
- connecting a qrcode to the current session user
- deleting the current session user

*/

const User = require("../models/userModel")
const QrCode = require("../models/qrcodeModel")
const Session = require("../models/sessionModel")

/**
 * Gets all attributes of the current session user from the database.
 * @param {*} req The express request object.
 * @param {*} res The express response object.
 */
function get(req, res) {
    User.findOne({ instagramUserID: req.session.instagramUserID })
    .exec((err, user) => {
        if (err) res.send(err)
        else res.send(user)
    })
}

/**
 * Sets all attributes given in the POST body in the database.
 * @param {*} req The express request object.
 * @param {*} res The express response object.
 */
function set(req, res) {
    User.findOneAndUpdate({ instagramUserID: req.session.instagramUserID }, req.body)
    .exec((err, user) => {
        if (err) res.send(err)
        else res.send(user)
    })
}

/**
 * Connects a single qrcode to the current session user.
 * The qrcode ID is given via the POST body.
 * @param {*} req The express request object.
 * @param {*} res The express response object.
 */
function connect(req, res) {
    Promise.all([
        QrCode.findByIdAndUpdate(req.body.qrID, { connectedUser: req.session.instagramUserID }, { upsert: true }),
        User.findOneAndUpdate({ instagramUserID: req.session.instagramUserID }, { $addToSet: { qrcodes: req.body.qrID }})
    ])
    .then(response => res.send(response))
}

/**
 * Completely deletes the current session user from the database.
 * Also disconnects all connected qrcodes and deletes all sessions
 * of that user.
 * @param {*} req The express request object.
 * @param {*} res The express response object. 
 */
function del(req, res) {
    Promise.all([
        QrCode.updateMany({ connectedUser: req.session.instagramUserID }, { connectedUser: undefined }),
        User.deleteOne({ instagramUserID: req.session.instagramUserID }),
        Session.deleteMany({ session: { $regex: req.session.instagramUserID, $options: "i" } })
    ])
    .then(() => res.sendStatus(200))

}

module.exports = { get, set, connect, del }