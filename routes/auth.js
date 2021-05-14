const express = require("express")
const router = express.Router()

const controller = require("../controllers/auth")

router.use(controller.checkForPermissions)

router.get("/", controller.auth)

module.exports = router