const express = require("express")
const router = express.Router()

const helper = require("../modules/helper")

router.get("/:username", (req, res) => {
    
    helper.getUserByUsername(req.params.username)
    .then(user => {
        // if the user can be found
        if (user) {
            Promise.all([
                        helper.getOembed(req.params.username),
                        helper.getOembed("eatleryforfuture")
            ])
            .then(([partnerInstagram, eatleryInstagram]) => {
                res.render("collab", { partnerInstagram: partnerInstagram, eatleryInstagram, eatleryInstagram, username: req.params.username })
            })
        }
        else {
            res.redirect("../")
        }
    })
})

module.exports = router