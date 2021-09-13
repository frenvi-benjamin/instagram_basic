const User = require("../models/userModel")
const fetch = require("node-fetch")

function checkForActiveQrcode (req, res, next) {
    if (!req.query.qr) return next()

    const qrID = req.query.qr

    User.findOne({ qrcodes: qrID })
    .then(
        user => {
            if (!user) return next()
            // register the scan for the user
            User.findOneAndUpdate(
                { instagramUserID: user.instagramUserID },
                {
                    $inc: { nrOfScans: 1 },
                    $push: { scans: new Date() }
                },
                { upsert: true }
            ).exec()
            // lottery
            // set lottery session details if not set
            if (req.session.lottery == undefined) req.session.lottery = {}
            // only enter user in lottery if he was last entered more than a week ago or never before entered
            if ((Date.now() - req.session.lottery.time) > 1000*60*60*24*7 || req.session.lottery.time == undefined) { // last lottery entered has to be a week old
                // choose a winner by chance
                console.log("lottery entered")
                if (Math.random() <= .1) {
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
        }
    )
}

function render (req, res) {
    User.findOne({ instagramUserID: req.session.instagramUserID })
    .then(user => {
        fetch(`https://graph.instagram.com/me/media?fields=media_type,permalink,media_url,thumbnail_url&access_token=${req.session.accessToken}`)
        .then(response => response.json())
        .then(body => {
        res.render("index", { user: user, media: body.data })

        })
    })
}

module.exports = { render, checkForActiveQrcode }