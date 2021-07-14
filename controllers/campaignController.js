const helper = require("../modules/helper")
const User = require("../models/userModel")

function checkUserExistance(req, res, next) {
    User.findOne({ username: req.params.username })
    .then(user => {
            if (user) return next()
            else return res.redirect("/404", )
    })
}

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

function renderPreview(req, res) {
    const username = req.query.username
    const promotedPost = req.query.promotedPost

    Promise.all([
        helper.buildOembed(username, promotedPost),
        helper.getOembed("eatleryforfuture"),
    ])
    .then(([partnerInstagram, eatleryInstagram, user]) => {
        res.render("campaign", { partnerInstagram: partnerInstagram, eatleryInstagram, eatleryInstagram, username: req.params.username, lottery: { winner: false }, rewardType: 1 })
    })

}

function checkPublicity(req, res, next) {
    User.findOne({ username: req.params.username})
    .then(user => {
        if (user.public) return next()
        else return res.render("error", { title: "Kampagne nicht öffentlich", message: "Die gesuchte Seite kann nicht aufgerufen werden, da die Kampagne noch nicht veröffentlicht wurde." })
    })
}

module.exports = { render, renderPreview, checkPublicity, checkUserExistance }