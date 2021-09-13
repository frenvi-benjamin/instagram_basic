/*

Controller for the admin user route ( /routes/admin/userRoute.js )

Responsible for

- sending rendered user information
- deleting users

*/

const path = require("path")
const ejs = require("ejs")

const User = require("../../models/userModel")
const QrCode = require("../../models/qrcodeModel")

/**
 * Sends the rendered HTML of a single user if given a username in the POST body.
 * Else it sends the rendered HTML of all users.
 * If a username is given but not found, it sends a rendered Error message.
 * @param {*} req The express request object.
 * @param {*} res The express response object.
 */
function get(req, res) {
    if (req.body.username) {
        User.findOne({ username: req.body.username })
        .then(
            user => {
                ejs.renderFile(path.join(__dirname, "../../views/partials/admin/user-tab/single-user.ejs"), { user: user })
                .then(rendered => res.send(rendered))
            },
            () => {
                ejs.renderFile(path.join(__dirname, "../../views/partials/admin/response.ejs"), { message: "Konnte den User nicht finden", good: false })
                .then(rendered => res.send(rendered))
            }
        )
    }
    else {
        User.find({})
        .then(users => {
            ejs.renderFile(path.join(__dirname, "../../views/partials/admin/user-tab/all-users.ejs"), { users: users })
            .then(rendered => res.send(rendered))
        })
    }
}

/**
 * Deletes a single user and their connected qrcodes.
 * The username is given via the POST body.
 * @param {*} req The express request object.
 * @param {*} res The express response object.
 */
function del(req, res) {
    User.findOne({ username: req.body.username })
    .then(user => {
        Promise.all([
            QrCode.deleteMany({ _id: { $in: user.qrcodes }}),
            User.deleteOne({ instagramUserID: user.instagramUserID })
        ])
        .then(() => res.redirect("/admin#user"))
    })
}

module.exports = { get, del }