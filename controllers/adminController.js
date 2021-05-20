const Admin = require("../models/adminModel")

function authLogin(req, res) {
    const username = req.body.username
    const password = req.body.password

    Admin.findOne({ username: username, password: password})
    .then(user => {
        if (user) {
            req.session.admin = true
            return res.redirect("/admin")
        }
        else {
            return res.render("admin-login")
        }
    })
}

module.exports = { authLogin }