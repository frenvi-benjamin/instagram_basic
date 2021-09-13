/*

Controller for the admin qrcode route ( /routes/admin/qrcodeRoute.js )

Responsible for multiple things concerning qrcodes:

- create new qrcodes in databank
- create the actual qrcode file that can be scanned
- let the admin download the qrcode files
- delete qrcodes of certain users or all users

*/

const path = require("path")
const ejs = require("ejs")
const QRCode = require("../../modules/qrcode-svg/dist/qrcode.min.js")

const QrCode = require("../../models/qrcodeModel")
const User = require("../../models/userModel")

/**
 * Creates n new qrcodes in the database. n is given via the body of a POST request. 
 * @param {*} req The express request object.
 * @param {*} res The express response object.
 */
function create(req, res) {
    const n = req.body.nQrcodes
    let a = []
    for (let i = 0; i < n; i++) {
        a.push({})
    }
    QrCode.insertMany(a)
    .then(newQrcodes => res.send(createQrcodeFiles(newQrcodes)))
}

/**
 * Creates svg-files from the qrcode id's
 * @param {String | Array} qrcodes  Can be either a string that when parsed gives an array of qrcode id's
 *                                  or can be an array of qrcode models from the databank.
 * @returns {Array} The svg-files of the qrcodes
 */
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

/**
 * Zips svg-files and lets the admin download them.
 * If not given files it creates files from the given qrcodes
 * and then prepares the download.
 * @param {*} req The express request object.
 * @param {*} res The express response object.
 */
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

/**
 * Deletes all qrcodes connected to a user if given an instagram username via the request body.
 * If not given a username it deletes all qrcodes connected to all users.
 * @param {*} req The express request object.
 * @param {*} res The express response object.
 */
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

/**
 * Sends the files of qrcodes.
 * The POST body may contain the type all, unused or one.
 * Sends the files of respectively all, all unused or a single (given in the POST body) qrcode.
 * Sends files as array except type is one where the single file is sent without an array.
 * @param {*} req The express request object.
 * @param {*} res The express response object.
 */
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