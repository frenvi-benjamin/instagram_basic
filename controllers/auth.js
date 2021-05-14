const helper = require("../modules/helper")
const fetch = require("node-fetch")


function checkForPermissions(req, res) {
    if (!req.query.code) return res.render("request-permissions")

    // get short lived access token with given authentication code
    return fetch("https://api.instagram.com/oauth/access_token", {
        method: "POST",
        body: {
            code: req.query.code,
            client_id: process.env.INSTAGRAM_APP_ID,
            client_secret: process.env.INSTAGRAM_APP_SECRET,
            grant_type: "authorization_code",
            redirect_uri: process.env.HOST + "/auth"
        }
    })
    .then(response => response.text())
    .then(body => {console.log(body); return body.access_token})
    // test if user gave access to media
    .then(SLAT => {
        return fetch(`https://graph.instagram.com/me/media?fields=permalink&access_token=${SLAT}`)
        .then(response => response.json())
        .then(body => {
            if (body.error) {
                return res.render("request-permissions")
            }
            else {
                req.session.accessToken = SLAT
                return next()
            }
        })
    })
}


function auth(req, res) {
    const url = `https://graph.instagram.com/access_token?` +
                `grant_type=ig_exchange_token&` +
                `client_secret=${process.env.INSTAGRAM_APP_SECRET}&` +
                `access_token=${req.session.accessToken}`

    fetch(url)
    .then(response => response.json())
    .then(body => {
        const longLivedAccessToken = body.access_token

        helper.createUserFromAccessToken(longLivedAccessToken)
        .then(user => {
            req.session.accessToken = user.accessToken
            req.session.username = user.username
            req.session.instagramUserID = user.instagramUserID

            res.redirect("/scanner")
        })
    })
}

module.exports = { auth, checkForPermissions }