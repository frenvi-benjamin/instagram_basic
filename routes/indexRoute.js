const express = require("express")
const router = express.Router()

const controller = require("../controllers/indexController")
const sharedController = require("../controllers/sharedController")

router.use(controller.checkForActiveQrcode)

router.use(sharedController.checkForUserSession)

router.get("/", controller.renderIndex)

module.exports = router