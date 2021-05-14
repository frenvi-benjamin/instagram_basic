const helper = require("../modules/helper")

function checkForActiveQrcode (req, res, next) {
    if (!req.query.qr) return next()

    const qrID = req.query.qr

    helper.getConnectedUser(qrID)
    .then(
        user => {
            helper.incrementNrOfScans(user.username)
            res.redirect(`/collab/${user.username}`)
        },
        () => {return next()}
    )
}

function renderIndex (req, res) {
    res.render("index", { instagramAppID: process.env.INSTAGRAM_APP_ID, oauthRedirectURI: process.env.HOST + "/auth" })
}

module.exports = { renderIndex, checkForActiveQrcode }