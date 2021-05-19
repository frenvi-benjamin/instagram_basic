const helper = require("../modules/helper")

function checkUserExistance(req, res, next) {
    helper.getUser(req.params.username)
    .then(
        () => {return next(req, res)},
        () => {return res.redirect("../")}
    )
}

function render (req, res) {
    Promise.all([
        helper.getOembed(req.params.username),
        helper.getOembed("eatleryforfuture")
    ])
    .then(([partnerInstagram, eatleryInstagram]) => {
        res.render("collab", { partnerInstagram: partnerInstagram, eatleryInstagram, eatleryInstagram, username: req.params.username })
    })
    .catch(() => {
        res.render("no-permissions")
    })
}

function renderCollabPage (req, res) {
    checkUserExistance(req, res, render)
}

module.exports = { renderCollabPage }