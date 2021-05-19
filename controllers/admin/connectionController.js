const helper = require("../../modules/helper")

const path = require("path")
const ejs = require("ejs")
const QrCode = require("../../models/qrcodeModel")

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

function assureUnusedQrcode(req, res, next) {
    QrCode.findById(req.body.qrID)
    .then(qrcode => {
        if (qrcode.connectedUser) {
            console.log("qrcode already registered")
            return res.sendStatus(451)
        }
        else {
            console.log("qrcode unregistered")
            return next()
        }
    })
}

function create(req, res) {
    helper.connectQrcodeToUser(req.body.qrID, req.session.instagramUserID)
}

module.exports = { clear, create, assureUnusedQrcode }