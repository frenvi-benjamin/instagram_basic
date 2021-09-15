/*

Controller for the campaign route ( /routes/campaignRoute.js )

Responsible for rendering the campaign pages of users and the preview campaign page.

*/

const helper = require("../modules/helper")
const User = require("../models/userModel")

/**
 * Express middleware to ensure the user given in the URL exists in our database.
 * Shows 404 error page if no user is found.
 * @param {*} req The express request object.
 * @param {*} res The express response object.
 * @param {*} next The express next object.
 */
function checkUserExistance(req, res, next) {
    User.findOne({ username: req.params.username })
    .then(user => {
            if (user) return next()
            else return res.redirect("/404", )
    })
}

/**
 * Express middleware to ensure that the user given in the URL has published their campaign.
 * If not displays an error page explaining that the user has not published their campaign.
 * @param {*} req The express request object.
 * @param {*} res The express response object.
 * @param {*} next The express next object.
 */
 function checkPublicity(req, res, next) {
    User.findOne({ username: req.params.username})
    .then(user => {
        if (user.public) return next()
        else return res.render("error", { title: "Kampagne nicht öffentlich", message: "Die gesuchte Seite kann nicht aufgerufen werden, da die Kampagne noch nicht veröffentlicht wurde." })
    })
}

/**
 * Gets the oEmbed for the user given in the URL and renders the campaign page.
 * @param {*} req The express request object.
 * @param {*} res The express response object.
 */
function render (req, res) {
    Promise.all([
        helper.getOembed(req.params.username),
        helper.getOembed("eatleryforfuture"),
        User.findOne({ username: req.params.username })
    ])
    .then(([partnerInstagram, eatleryInstagram, user]) => {
        res.render("campaign", { partnerInstagram: partnerInstagram, eatleryInstagram, eatleryInstagram, username: req.params.username, lottery: req.session.lottery, rewardType: user.rewardType })
        try {
            req.session.lottery.winner = false
        } catch {}
    })
    .catch((err) => {
        console.log(err)
        res.render("error", { title: "Error", message: "Die gesuchte Seite kann nicht aufgerufen werden, da der zugehörige Partner die Erlaubnis zum Teilen seiner Instagram-Inhalte zurückgezogen hat."})
    })
}

/**
 * Renders a preview campaign page with the username and Instagram post
 * URL given in the URL query parameters. This is required to render a campaign page
 * without the the user having saved their choice of Instagram post to the database
 * and publishing their campaign.
 * @param {*} req The express request object.
 * @param {*} res The express response object.
 */
async function renderPreview(req, res) {
    const username = req.query.username
    let promotedPost = req.query.promotedPost

    if (!promotedPost) {
        await helper.getNewestPost(username)
        .then(post =>{
            promotedPost = post.permalink
        })
    }

    Promise.all([
        helper.buildOembed(promotedPost),
        helper.getOembed("eatleryforfuture"),
    ])
    .then(([partnerInstagram, eatleryInstagram]) => {
        res.render("campaign", { partnerInstagram: partnerInstagram, eatleryInstagram, eatleryInstagram, username: req.params.username, lottery: { winner: false }, rewardType: 1 })
    })

}

module.exports = { render, renderPreview, checkPublicity, checkUserExistance }