const path = require("path")
const ejs = require("ejs")
const QRCode = require("../../modules/qrcode-svg/dist/qrcode.min.js")

const QrCode = require("../../models/qrcodeModel")
const User = require("../../models/userModel")

function create(req, res) {
    const n = req.body.nQrcodes
    let a = []
    for (let i = 0; i < n; i++) {
        a.push({})
    }
    QrCode.insertMany(a)
    .then(newQrcodes => res.send(createQrcodeFiles(newQrcodes)))
}

function createQrcodeFiles(qrcodes) {
    var files = []

    if (typeof qrcodes == "string") {
        qrcodes = JSON.parse(qrcodes)
    }

    qrcodes.forEach(qrcode => {
        // qrcode can either be the qrcode model from db or just the id
        const qrID = qrcode._id || qrcode
        let qrcodeImage = new QRCode({
            content: `${process.env.HOST}?qr=${qrID}`,
            color: "black",
            background: "none",
            join: true, // joins all vector graphics paths
            ecl: "H",
        })
        files.push({
            content: qrcodeImage.svg(),
            name: qrID + ".svg",
            date: new Date(),
            type: "file",
        })
    })

    return files
}

function download(req, res) {
    let files = req.body.files || createQrcodeFiles(req.body.qrcodes)

    if (typeof files == "string") {
        files = JSON.parse(files)
    }

    res.zip({
        files: files,
        filename: "qrcodes.zip"
    })
}

function del(req, res) {
    if (req.body.username) {
        User.findOneAndUpdate({ username: req.body.username }, { qrcodes: [] }, { returnOriginal: true })
        .then(user => QrCode.deleteMany({ _id: { $in: user.qrcodes }}))
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
        Promise.all([
            User.updateMany({}, { qrcodes: [] }),
            QrCode.deleteMany({})
        ])
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

function getFiles(req, res) {
    switch (req.body.type) {
        case "all":
            QrCode.find({})
            .then(qrcodes => res.send(createQrcodeFiles(qrcodes)))
            break;
        case "unused":
            QrCode.find({ connectedUser: undefined })
            .then(qrcodes => res.send(createQrcodeFiles(qrcodes)))
            break;
        case "one":
            QrCode.findById(req.body.one)
            .then(qrcode => res.send(createQrcodeFiles([qrcode])[0]))
            break;
    }
} 

module.exports = { create, download, del, getFiles }