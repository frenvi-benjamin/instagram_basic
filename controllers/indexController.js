/*

Controller for the index route ( /routes/indexRoute.js )

Responsible for

- redirecting to a campaign page if an active qrcode ID is in the URL parameters
- entering end user into lottery
- rendering the index page

*/

const User = require("../models/userModel")
const fetch = require("node-fetch")

/**
 * Express middleware to check for a qrcode ID in the URL parameters and redirect
 * to the campaign page of the user that is connected to the qrcode.
 * If an active qrcode is found, this means an end user has scanned a registered
 * qrcode so that user is entered into the lottery and the scan is registered to
 * the user connected to the qrcode.
 * @param {*} req The express request object.
 * @param {*} res The express response object.
 * @param {*} next The express next object.
 */
function checkForActiveQrcode (req, res, next) {
    // continue with next express task if no qr URL paramter is found
    if (!req.query.qr) return next()

    const qrID = req.query.qr

    User.findOne({ qrcodes: qrID })
    .then(
        user => {
            // continue with next express task if no user is connected to scanned qrcode
            if (!user) return next()
            // register the scan for the user that this qrcode leads to
            User.findOneAndUpdate(
                { instagramUserID: user.instagramUserID },
                {
                    $push: { scans: new Date() }
                },
                { upsert: true }
            ).exec()
            // enter end user into lottery
            enterLottery(req)
            res.redirect(`/campaign/${user.username}`)
        }
    )
}

/**
 * Called when a qrcode connected to a user is scanned.
 * Enters the current session user into the lottery if eligible.
 * @param {*} req The express request object.
 */
function enterLottery(req) {
    // set lottery session details if not set
    if (req.session.lottery == undefined) req.session.lottery = {}

    // only enter user in lottery if he was last entered more than a week ago or never before entered
    if ((Date.now() - req.session.lottery.time) > 1000*60*60*24*7 || req.session.lottery.time == undefined) {
        
        // choose a winner by chance
        
        if (Math.random() <= .1) {
            req.session.lottery.winner = true
        }

        // set time entered into the lottery regardless of win or not
        req.session.lottery.time = Date.now()
    }
    else {
        // if not eligible to enter set winner to false
        req.session.lottery.winner = false
    }
}

/**
 * Renders the /views/index.ejs view.
 * @param {*} req The express request object.
 * @param {*} res The express response object.
 */
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