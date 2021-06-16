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
    console.log("qrcode ID: ", req.body.qrID)
    QrCode.findById(req.body.qrID)
    .then(qrcode => {
        console.log("connectedUser: ", qrcode.connectedUser)
        if (qrcode.connectedUser) {
            return res.sendStatus(451)
        }
        else {
            return next()
        }
    })
}

function create(req, res) {
    helper.connectQrcodeToUser(req.body.qrID, req.session.instagramUserID)
    .then(res.sendStatus(200))
}

module.exports = { clear, create, assureUnusedQrcode }