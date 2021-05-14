const express = require("express")
const router = express.Router()

const controller = require("../../controllers/admin/user")

router.post("/get", controller.get)

router.post("/delete", controller.del)

module.exports = router