function render(req, res) {
    res.render("preview", { username: req.session.username })
}

module.exports = { render }