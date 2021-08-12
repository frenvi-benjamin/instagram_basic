const fetch = require("node-fetch")
const User = require("../models/userModel")

function render(req, res) {
    console.log("starting render setup")
    fetch(`https://graph.instagram.com/me/media?fields=media_url,media_type,thumbnail_url,permalink&access_token=${req.session.accessToken}`)
    .then(response => response.json())
    .then(body => {
        console.log("received media")
        if (body.data) {
            User.findOne({ username: req.session.username })
            .then(user => {
                console.log("found user, starting render")
                res.render("setup", { media: body.data, rewardType: user.rewardType, promotedPost: user.promotedPost, instagramUserID: req.session.instagramUserID, accessToken: req.session.accessToken, username: req.session.username })
                console.log("finished render")
            })
            
        }
        else {
            res.render("request-permissions", { oauthRedirectURI: process.env.HOST + req.originalUrl })
        }
    })
}

function redirectIfAlreadySetup(req, res, next) {
    User.findOne({ instagramUserID: req.session.instagramUserID })
    .then(user => {
        if (user.public) res.redirect("/")
        else next()
    })
}

module.exports = { render, redirectIfAlreadySetup }