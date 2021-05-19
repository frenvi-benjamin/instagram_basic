const fetch = require("node-fetch")

function render(req, res) {
    fetch(`https://graph.instagram.com/${17841404030696548}/media?fields=media_url&access_token=IGQVJXQXRWT2RoSzhhVzUtNEI1ZAXA2aGs0eUdQeTJHYnRKQ0tKNHdZATEEwQUVfcHAzdmNmNDNoWXFYZAXBxYWdLS1k5SVlTUF9aazN1OFJCMkUwLTRDYWotQkhRLUt5SWpJRzdKV1FR`)
    .then(response => response.json())
    .then(body => {console.log(body.data); return body})
    .then(body => res.render("choose", { media: body.data }))
}

module.exports = { render }