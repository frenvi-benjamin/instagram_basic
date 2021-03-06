/*

Controller shared between multiple routers

Responsible for

- checking if user is logged in
- checking if user has admin privileges
- processing a user that has been redirected from the Instagram oAuth

*/

require("dotenv").config()
const User = require("../models/userModel")
const FormData = require("form-data")
const fetch = require("node-fetch")

/**
 * Checks if there is a user currently logged in and adds
 * username, access token and instagram user ID to the locals
 * so that it can be accessed in any ejs views.
 * Renders /views/welcome.ejs view if no user is logged in.
 * @param {*} req The express request object.
 * @param {*} res The express response object.
 * @param {*} next The express next object.
 */
function checkForUserSession(req, res, next) {
    if (req.session.username) {
        res.locals.user = {
            username: req.session.username,
            accessToken: req.session.accessToken,
            instagramUserID: req.session.instagramUserID,
        }
        return next()
    }
    else {
        res.render("welcome")
    }
}

/**
 * Checks if the current session user has logged in
 * as an admin. If not render the /views/admin-login.ejs view
 * to prompt the login.
 * @param {*} req The express request object.
 * @param {*} res The express response object.
 * @param {*} next The express next object.
 */
function checkAdminAuth(req, res, next) {
    if (req.session.admin === true) {
        return next()
    }
    else {
        return res.render("admin-login")
    }
}

/**
 * Processes the redirect from the Instagram oAuth.
 * Takes the given code and turns it into a short lived
 * and then a long lived access token. Also renders
 * the /views/request-permissions.ejs view if the user has
 * given none or not all required permissions.
 * @param {*} req The express request object.
 * @param {*} res The express response object.
 * @param {*} next The express next object.
 */
function auth(req, res, next) {
    res.locals.cookiesAccepted = req.session.cookiesAccepted

    if (req.query.error == "access_denied") {
        return res.render("request-permissions", {
            oauthRedirectURI: process.env.HOST + req.originalUrl
        })
    }
    if (!req.query.code || req.session.username) return next()

    var formdata = new FormData()
    formdata.append("code", req.query.code)
    formdata.append("client_id", process.env.INSTAGRAM_APP_ID)
    formdata.append("client_secret", process.env.INSTAGRAM_APP_SECRET)
    formdata.append("grant_type", "authorization_code")
    formdata.append("redirect_uri", process.env.HOST + req.originalUrl)

    var requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
    }
    // get short lived access token with given authentication code
    fetch("https://api.instagram.com/oauth/access_token", requestOptions)
    .then(response => response.json())
    .then(body => body.access_token)
    // test if user gave access to media
    .then(SLAT => {
        return fetch(`https://graph.instagram.com/me/media?fields=permalink&access_token=${SLAT}`)
        .then(response => response.json())
        .then(body => {
            if (body.error) {
                return res.render("request-permissions", { oauthRedirectURI: process.env.HOST + req.originalUrl })
            }
            else {
                const url = `https://graph.instagram.com/access_token?` +
                    `grant_type=ig_exchange_token&` +
                    `client_secret=${process.env.INSTAGRAM_APP_SECRET}&` +
                    `access_token=${SLAT}`

                fetch(url)
                .then(response => response.json())
                .then(body => {
                    const longLivedAccessToken = body.access_token

                    fetch(`https://graph.instagram.com/me/?fields=username,id&access_token=${longLivedAccessToken}`)
                    .then(response => response.json())
                    .then(response => {
                        User.findOneAndUpdate(
                            { instagramUserID: response.id },
                            {
                                username: response.username,
                                accessToken: longLivedAccessToken,
                                $setOnInsert: {scans: [], qrcodes: []}
                            },
                            { upsert: true }
                        )
                        .then(user => {
                            req.session.accessToken = user.accessToken
                            req.session.username = user.username
                            req.session.instagramUserID = user.instagramUserID
    
                            next()
                        })
                    })
                })
            }
        })
    })
}

module.exports = { checkForUserSession, checkAdminAuth, auth }