const helper = require("../modules/helper")

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
        helper.getOembed("eatleryforfuture")
    ])
    .then(([partnerInstagram, eatleryInstagram]) => {
        res.render("campaign", { partnerInstagram: partnerInstagram, eatleryInstagram, eatleryInstagram, username: req.params.username })
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