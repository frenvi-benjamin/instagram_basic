/*

Controller for the setup route ( /routes/setupRoute.js )

Responsible for

- rendering the setup page
- redirecting to the index page if user has already been through setup process

*/

const fetch = require("node-fetch")
const User = require("../models/userModel")

/**
 * Gets the Instagram media from the current user to display
 * on the setup page and renders the /views/setup.ejs view.
 * If the user has not given permissions for the Instagram media
 * renders the /views/request-permissions.ejs view to request
 * the permissions from the user.
 * @param {*} req The express request object.
 * @param {*} res The express response object.
 */
function render(req, res) {
    fetch(`https://graph.instagram.com/me/media?fields=media_url,media_type,thumbnail_url,permalink&access_token=${req.session.accessToken}`)
    .then(response => response.json())
    .then(body => {
        if (body.data) {
            User.findOne({ username: req.session.username })
            .then(user => {
                res.render("setup", { media: body.data, rewardType: user.rewardType, promotedPost: user.promotedPost, instagramUserID: req.session.instagramUserID, accessToken: req.session.accessToken, username: req.session.username })
            })
            
        }
        else {
            res.render("request-permissions", { oauthRedirectURI: process.env.HOST + req.originalUrl })
        }
    })
}

/**
 * Redirects to the index page if the current session user has
 * already published their campaign.
 * @param {*} req The express request object.
 * @param {*} res The express response object.
 * @param {*} next The express next object.
 */
function redirectIfAlreadySetup(req, res, next) {
    User.findOne({ instagramUserID: req.session.instagramUserID })
    .then(user => {
        if (user.public) res.redirect("/")
        else next()
    })
}

module.exports = { render, redirectIfAlreadySetup }