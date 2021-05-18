function checkForUserSession(req, res, next) {
    if (
        req.session.username
    ) { return next() }
    else {
        console.log("no active user session")
        res.redirect("/")
    }
}

module.exports = { checkForUserSession }