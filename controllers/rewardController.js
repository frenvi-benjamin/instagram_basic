const ejs = require("ejs")
const path = require("path")

function render(req, res) {
    res.render("reward")
}

function renderModal(req, res) {
    ejs.renderFile(path.join(__dirname, "../views/partials/winner.ejs"), { type: req.body.type })
    .then(rendered => {
        res.send(rendered)
    })
}

module.exports = { render, renderModal }