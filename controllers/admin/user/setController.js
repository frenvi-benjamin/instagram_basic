const User = require("../../../models/userModel")
const helper = require("../../../modules/helper")

function setPromotedPost(req, res) {
    helper.getPostPermalink(req.body.mediaID, "req.session.accessToken")
    .then(permalink => User.findOneAndUpdate({ instagramUserID: req.session.instagramUserID }, { promotedPost: permalink }))
    .then(updated => res.send(updated))
}

module.exports = { setPromotedPost }