function checkForUserSession(req, res, next) {
    if (
        req.session.username
    ) { return next() }
    else {
        res.redirect("/")
    }
}

module.exports = { checkForUserSession }