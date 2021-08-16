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

function checkPublicity(req, res, next) {
    User.findOne({ username: req.params.username})
    .then(user => {
        if (user.public) return next()
        else return res.render("error", { title: "Kampagne nicht öffentlich", message: "Die gesuchte Seite kann nicht aufgerufen werden, da die Kampagne noch nicht veröffentlicht wurde." })
    })
}

module.exports = { render, renderPreview, checkPublicity, checkUserExistance }