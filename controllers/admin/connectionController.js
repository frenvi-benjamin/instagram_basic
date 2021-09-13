/*

Controller for the admin connection route ( /routes/admin/connectionRoute.js )

Responsible for the connections between users and qrcodes.

*/

const path = require("path")
const ejs = require("ejs")
const User = require("../../models/userModel")
const QrCode = require("../../models/qrcodeModel")

/**
 * If given a username clears all connections between that user and their qrcodes.
 * If not given a username clears all connections betweens all users and their qrcodes.
 * @function clear
 * @param {*} req The express request object
 * @param {*} res The express response object
 */
function clear(req, res) {

    if (req.body.username) {
        User.findOneAndUpdate({ username: req.body.username }, { qrcodes: [] })
        .then(
            (user) => {
                QrCode.updateMany( { connectedUser: user.instagramUserID }, { connectedUser: undefined } ).exec()
                ejs.renderFile(path.join(__dirname, "../../views/partials/admin/response.ejs"), { message: "Verbindungen getrennt", good: true })
                    .then(rendered => res.send(rendered))
            },
            () => {
                ejs.renderFile(path.join(__dirname, "../../views/partials/admin/response.ejs"), { message: "Konnte den User nicht finden", good: false })
                    .then(rendered => res.send(rendered))
            }
        )
    }
    else {
        Promise.all([
            User.updateMany({}, { qrcodes: [] }),
            QrCode.updateMany({}, { connectedUser: undefined })
        ])
        .then(
            () => {
                ejs.renderFile(path.join(__dirname, "../../views/partials/admin/response.ejs"), { message: "Verbindungen getrennt", good: true })
                    .then(rendered => res.send(rendered))
            },
            () => {
                ejs.renderFile(path.join(__dirname, "../../views/partials/admin/response.ejs"), { message: "Fehler beim Suchen aufgetreten", good: false })
                    .then(rendered => res.send(rendered))
            }
        )
    }
}

module.exports = { clear }