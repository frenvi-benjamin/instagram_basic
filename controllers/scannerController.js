function renderScanner (req, res) {
    res.render("scanner", { instagramUserID: req.session.instagramUserID, accessToken: req.session.accessToken, username: req.session.username })
}

module.exports = { renderScanner }