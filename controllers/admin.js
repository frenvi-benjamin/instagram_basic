const Admin = require("../models/admin")


function checkAuth(req, res, next) {
    if (req.session.admin === true) {
        return next()
    }
    else {
        return res.render("admin-login")
    }
}

function authLogin(req, res) {
    const username = req.body.username
    const password = req.body.password

    Admin.findOne({ username: username, password: password})
    .then(user => {
        if (user) {
            req.session.admin = true
            return res.redirect("/admin")
        }
    })
}

module.exports = { checkAuth, authLogin }