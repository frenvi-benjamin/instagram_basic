/*

Controller for the choosePost route ( /routes/choosePostRoute.js )

Responsible for rendering the choosePage view ( /views/choose-page.ejs ).

*/

const fetch = require("node-fetch")
const User = require("../models/userModel")

/**
 * Gets all the users media from Instagram to display on the page
 * and renders the view.
 * If the user has not given the app permission to his Instagram media it renders
 * the request-permissions view to ask the user for those permissions.
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
                res.render("choose-post", { media: body.data, promotedPost: user.promotedPost })
            })
        }
        else {
            res.render("request-permissions", { oauthRedirectURI: process.env.HOST + req.originalUrl })
        }
    })
}

module.exports = { render }