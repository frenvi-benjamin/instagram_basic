const fetch = require("node-fetch")
const User = require("../models/userModel")
function render(req, res) {
    fetch(`https://graph.instagram.com/me/media?fields=media_url,media_type,thumbnail_url,permalink&access_token=${req.session.accessToken}`)
    .then(response => response.json())
    .then(body => {
        if (body.data) {
            User.findOne({ username: req.session.username })
            .then(user => {
                res.render("choose-post", { media: body.data, promotedPost: user.promotedPost })
            })
        }
        else {
            res.render("request-permissions", { oauthRedirectURI: process.env.HOST + req.originalUrl })
        }
    })
}

module.exports = { render }