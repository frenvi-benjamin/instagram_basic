const helper = require("../../modules/helper")

const path = require("path")
const ejs = require("ejs")

function clear(req, res) {

    if (req.body.username) {
        helper.clearConnections(req.body.username)
        .then(
            () => {
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
        helper.clearConnections()
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

function create(req, res) {
    helper.connectQrcodeToUser(req.body.qrID, req.session.instagramUserID)
}

function checkForUserSession(req, res, next) {
    if (
        req.session.username
    ) { return next() }
    else {
        res.redirect("/")
    }
}

module.exports = { clear, create, checkForUserSession }