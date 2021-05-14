const helper = require("../modules/helper")

function checkUserExistance(req, res, next) {
    console.log(JSON.stringify(req.params))
    helper.getUserByUsername(req.params.username)
    .then(
        () => {return next()},
        () => {return res.redirect("../")}
    )

}

function renderCollabPage (req, res) {
    console.log(JSON.stringify(req.params))
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

module.exports = { checkUserExistance, renderCollabPage }