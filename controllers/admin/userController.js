const path = require("path")
const ejs = require("ejs")

const User = require("../../models/userModel")
const QrCode = require("../../models/qrcodeModel")
function get(req, res) {
    if (req.body.username) {
        User.findOne({ username: req.body.username })
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
        User.findOne({})
        .then(users => {
            ejs.renderFile(path.join(__dirname, "../../views/partials/admin/user-tab/all-users.ejs"), { users: users })
            .then(rendered => res.send(rendered))
        })
    }
}

function del(req, res) {
    User.deleteOne({ username: req.body.username }, { returnOriginal: true })
    .then(user => QrCode.deleteMany({ _id: { $in: user.qrcodes }}))
    .then(() => res.redirect("/admin#user"))
    
}

module.exports = { get, del }