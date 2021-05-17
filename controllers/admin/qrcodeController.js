const path = require("path")
const ejs = require("ejs")
const QRCode = require("qrcode-svg")

const helper = require("../../modules/helper")

function create(req, res) {
    const n = req.body.nQrcodes
    helper.createQrcodes(n)
    .then(newQrcodes => {
        var files = []

        newQrcodes.forEach(qrcode => {
            const qrID = qrcode._id
            let qrcodeImage = new QRCode({
                content: `${process.env.HOST}?qr=${qrID}`,
                color: "black",
                background: "white",
                join: true // joins all vector graphics paths
            })
            files.push({
                content: qrcodeImage.svg(),
                name: qrID + ".svg",
                date: new Date(),
                type: "file",
            })
        })
        res.send(files)
    })
}

function download(req, res) {
    res.zip({
        files: JSON.parse(req.body.files),
        filename: "qrcodes.zip"
    })
}

function del(req, res) {
    if (req.body.username) {
        helper.deleteQrcodes(req.body.username)
        .then(
            () => {
                ejs.renderFile(path.join(__dirname, "../../views/partials/admin/response.ejs"), { message: "QR-Codes gelöscht", good: true })
                    .then(rendered => res.send(rendered))
            },
            () => {
                ejs.renderFile(path.join(__dirname, "../../views/partials/admin/response.ejs"), { message: "Konnte den User nicht finden", good: false })
                    .then(rendered => res.send(rendered))
            }
        )
    }
    else {
        helper.deleteQrcodes()
        .then(
            () => {
                ejs.renderFile(path.join(__dirname, "../../views/partials/admin/response.ejs"), { message: "QR-Codes gelöscht", good: true })
                    .then(rendered => res.send(rendered))
            },
            () => {
                ejs.renderFile(path.join(__dirname, "../../views/partials/admin/response.ejs"), { message: "Fehler beim Suchen aufgetreten", good: false })
                    .then(rendered => res.send(rendered))
            }
        )
    }
}

module.exports = { create, download, del }