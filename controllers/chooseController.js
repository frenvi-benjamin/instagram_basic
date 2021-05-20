const fetch = require("node-fetch")

function render(req, res) {
    fetch(`https://graph.instagram.com/me/media?fields=media_url&access_token=${req.session.accessToken}`)
    .then(response => response.json())
    .then(body => res.render("choose", { media: body.data }))
}

module.exports = { render }