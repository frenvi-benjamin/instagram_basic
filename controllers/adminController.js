/*

Controller for the admin route ( /routes/adminRoute.js )

Responsible for

- authenticating an admin user

*/

const Admin = require("../models/adminModel")

/**
 * Adds admin privileges to the current user's session if a valid username and password are given
 * via the POST body.
 * @param {*} req The express request object.
 * @param {*} res The express response object.
 */
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