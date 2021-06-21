const helper = require("../modules/helper")
const User = require("../models/userModel")

function checkUserExistance(req, res, next) {
    helper.getUser(req.params.username)
    .then(
        () => {return next(req, res)},
        () => {return res.render("404")}
    )
}

function render (req, res) {
    Promise.all([
        helper.getOembed(req.params.username),
        helper.getOembed("eatleryforfuture"),
        User.findOne({ username: req.params.username })
    ])
    .then(([partnerInstagram, eatleryInstagram, user]) => {
        res.render("campaign", { partnerInstagram: partnerInstagram, eatleryInstagram, eatleryInstagram, username: req.params.username, rewardType: user.rewardType })
    })
    .catch((err) => {
        console.log(err)
        res.render("no-permissions")
    })
}

function renderCampaignPage (req, res) {
    checkUserExistance(req, res, render)
}

module.exports = { renderCampaignPage }