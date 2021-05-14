const helper = require("../modules/helper")

function checkUserExistance(req, res, next) {
    helper.getUserByUsername(req.params.username)
    .then(
        () => {return next(req, res)},
        () => {return res.redirect("../")}
    )
}

function render (req, res) {
    helper.getUserByUsername(req.params.username)
    .then(() => {
        Promise.all([
            helper.getOembed(req.params.username),
            helper.getOembed("eatleryforfuture")
        ])
        .then(([partnerInstagram, eatleryInstagram]) => {
            res.render("collab", { partnerInstagram: partnerInstagram, eatleryInstagram, eatleryInstagram, username: req.params.username })
        })
    })
}

function renderCollabPage (req, res) {
    checkUserExistance(req, res, render)
}

module.exports = { checkUserExistance, renderCollabPage }