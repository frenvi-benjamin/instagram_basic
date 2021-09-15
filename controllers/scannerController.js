/*

Controller for the scanner route ( /routes/scannerRoute.js )

Responsible for rendering the /views/scanner.ejs view

*/

function renderScanner (req, res) {
    res.render("scanner", { instagramUserID: req.session.instagramUserID, accessToken: req.session.accessToken, username: req.session.username })
}

module.exports = { renderScanner }