const helper = require("../modules/helper")

function checkForActiveQrcode (req, res, next) {
    if (!req.query.qr) return next()

    const qrID = req.query.qr

    helper.getConnectedUser(qrID)
    .then(
        user => {
            helper.incrementNrOfScans(user.username)
            // lottery
            // set lottery session details if not set
            if (req.session.lottery == undefined) req.session.lottery = {}
            // only enter user in lottery if he was last entered more than a week ago or never before entered
            if ((Date.now() - req.session.lottery.time) > 5000/*1000*60*60*24*7*/ || req.session.lottery.time == undefined) { // last lottery entered has to be a week old
                // choose a winner by chance
                console.log("lottery entered")
                if (Math.random() <= 1) {
                    console.log("lottery won")
                    req.session.lottery.winner = true
                }
                // set time entered into the lottery regardless of win or not
                req.session.lottery.time = Date.now()
            }
            else {
                // if not eligible to enter set winner to false
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