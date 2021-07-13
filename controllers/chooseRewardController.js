const ejs = require("ejs")
const path = require("path")
const User = require("../models/userModel")

function render(req, res) {
    User.findOne({ instagramUserID: req.session.instagramUserID })
    .then(user => {
        res.render("choose-reward", { rewardType: user.rewardType })
    })
}

function renderModal(req, res) {
    ejs.renderFile(path.join(__dirname, "../views/partials/winner.ejs"), { type: req.body.type })
    .then(rendered => {
        res.send(rendered)
    })
}

function setRewardType(req, res) {
    User.findOneAndUpdate({ username: req.session.username }, { rewardType: req.body.type }).exec()
    res.sendStatus(200)
}

function getRewardType(req, res) {
    User.findOne({ username: req.session.username })
    .then(user => res.send(user))
}

module.exports = { render, renderModal, setRewardType, getRewardType }