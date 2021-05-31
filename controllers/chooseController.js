const fetch = require("node-fetch")

function render(req, res) {
    fetch(`https://graph.instagram.com/me/media?fields=media_url&access_token=${req.session.accessToken}`)
    .then(response => response.json())
    .then(body => res.render("choose", { media: body.data }))
    .catch((err) => {
        console.log(err)
        res.render("request-permissions", {
            instagramAppID: process.env.INSTAGRAM_APP_ID,
            oauthRedirectURI: process.env.HOST + req.originalUrl
        })
    })
}

module.exports = { render }