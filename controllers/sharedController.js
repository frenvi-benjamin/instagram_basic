require("dotenv").config()

function checkForUserSession(req, res, next) {
    if (
        req.session.username
    ) { return next() }
    else {
        res.render("login", { instagramAppID: process.env.INSTAGRAM_APP_ID, oauthRedirectURI: process.env.HOST + req.baseUrl })
    }
}

function checkAdminAuth(req, res, next) {
    if (req.session.admin === true) {
        return next()
    }
    else {
        return res.render("admin-login")
    }
}

module.exports = { checkForUserSession, checkAdminAuth }