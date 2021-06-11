const express = require("express")
const router = express.Router()

const controller = require("../controllers/previewController")
const sharedController = require("../controllers/sharedController")

router.get("/", sharedController.checkForUserSession, controller.render)

module.exports = router