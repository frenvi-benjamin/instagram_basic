const helper = require("../modules/helper")

function renderExample(req, res) {
    Promise.all([
        helper.getOembed("eisdiele_um_die_ecke"),
        helper.getOembed("eatleryforfuture")
    ])
    .then(([partnerInstagram, eatleryInstagram]) => {
        res.render("collab", { partnerInstagram: partnerInstagram, eatleryInstagram, eatleryInstagram, username: "eisdiele_um_die_ecke" })
    })
    .catch((err) => {
        console.log(err)
        res.render("no-permissions")
    })
}

module.exports = { renderExample }