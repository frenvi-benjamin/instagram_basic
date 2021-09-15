/*

Controller for the chooseReward route ( /routes/chooseRewardRoute.js )

Responsible for

- rendering the chooseReward view ( /views/choose-reward.ejs ).
- rendering the modal with a given reward type

*/

const ejs = require("ejs")
const path = require("path")
const User = require("../models/userModel")

/**
 * Gets the current users reward type and renders the choose-reward view.
 * @param {*} req The express request object.
 * @param {*} res The express response object.
 */
function render(req, res) {
    User.findOne({ instagramUserID: req.session.instagramUserID })
    .then(user => {
        res.render("choose-reward", { rewardType: user.rewardType })
    })
}

/**
 * Is given a reward type via POST body, renders the /views/partials/winner.ejs
 * modal and sends the rendered modal back.
 * @param {*} req The express request object.
 * @param {*} res The express response object.
 */
function renderModal(req, res) {
    ejs.renderFile(path.join(__dirname, "../views/partials/winner.ejs"), { type: req.body.type })
    .then(rendered => {
        res.send(rendered)
    })
}

module.exports = { render, renderModal }