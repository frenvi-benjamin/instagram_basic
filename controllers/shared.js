function checkForUserSession(req, res, next) {
    if (req.session.username) {
        console.log("Active user session. Username: ", req.session.username)
        return next()
    }
    else {
        console.log("No active user session. Redirecting to Login")
        res.redirect("/")
    }
}

module.exports = { checkForUserSession }