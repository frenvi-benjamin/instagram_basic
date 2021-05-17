const path = require("path")
const ejs = require("ejs")

const helper = require("../../modules/helper")

function get(req, res) {
    if (req.body.username) {
        helper.getUser(req.body.username)
        .then(
            user => {
                ejs.renderFile(path.join(__dirname, "../../views/partials/admin/user-tab/single-user.ejs"), { user: user })
                .then(rendered => res.send(rendered))
            },
            () => {
                ejs.renderFile(path.join(__dirname, "../../views/partials/admin/response.ejs"), { message: "Konnte den User nicht finden", good: false })
                .then(rendered => res.send(rendered))
            }
        )
    }
    else {
        helper.getUser()
        .then(users => {
            ejs.renderFile(path.join(__dirname, "../../views/partials/admin/user-tab/all-users.ejs"), { users: users })
            .then(rendered => res.send(rendered))
        })
    }
}

function del(req, res) {
    helper.deleteUser(req.body.username, true)
}

module.exports = { get, del }