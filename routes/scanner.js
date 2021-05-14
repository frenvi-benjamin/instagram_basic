const express = require("express")
const router = express.Router()

// user session check middleware
router.use((req, res, next) => {
    if (
        req.session.username
    ) { return next() }
    else {
        res.redirect("/")
    }
})
// all routes below require an active session. if no session is active the user will be redirected to the login page

router.get("/scanner", (req, res) => {
    const hasVisitedScanner = req.session.hasVisitedScanner | false
    req.session.hasVisitedScanner = true
    res.render("scanner", { instagramUserID: req.session.instagramUserID, accessToken: req.session.accessToken, username: req.session.username, hasVisitedScanner: hasVisitedScanner })
})

module.exports = router