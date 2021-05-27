const express = require("express")
const router = express.Router()

const controller = require("../controllers/indexController")
const sharedController = require("../controllers/sharedController")

router.get("/", controller.checkForActiveQrcode, sharedController.checkForUserSession, controller.renderIndex)

module.exports = router