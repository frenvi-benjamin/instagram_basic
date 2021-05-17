function renderScanner (req, res) {
    const hasVisitedScanner = req.session.hasVisitedScanner | false
    req.session.hasVisitedScanner = true
    res.render("scanner", { instagramUserID: req.session.instagramUserID, accessToken: req.session.accessToken, username: req.session.username, hasVisitedScanner: hasVisitedScanner })
}

module.exports = { renderScanner }