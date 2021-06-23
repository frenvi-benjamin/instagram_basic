const helper = require("../modules/helper")

function checkForActiveQrcode (req, res, next) {
    if (!req.query.qr) return next()

    const qrID = req.query.qr

    helper.getConnectedUser(qrID)
    .then(
        user => {
            helper.incrementNrOfScans(user.username)
            // lottery
            if (req.session.lottery == undefined) req.session.lottery = {}
            if ((Date.now() - req.session.lottery.time) > 604800000 || req.session.lottery.time == undefined) { // last lottery entered has to be a week old
                if (Math.random() <= 0.9) {
                    req.session.lottery.winner = true
                }
                req.session.lottery.time = Date.now()
            }
            else {
                req.session.lottery.winner = false
            }
            res.redirect(`/campaign/${user.username}`)
        },
        () => {return next()}
    )
}

function renderIndex (req, res) {
    res.render("index")
}

module.exports = { renderIndex, checkForActiveQrcode }