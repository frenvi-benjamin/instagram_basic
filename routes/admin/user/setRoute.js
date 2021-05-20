const express = require("express")
const router = express.Router()

const controller = require("../../../controllers/admin/user/setController")

router.post("/promotedPost", controller.setPromotedPost)

module.exports = router