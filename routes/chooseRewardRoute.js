const express = require("express")
const router = express.Router()

const controller = require("../controllers/chooseRewardController")
const sharedController = require("../controllers/sharedController")

router.get("/", sharedController.checkForUserSession, controller.render)

router.post("/modal", sharedController.checkForUserSession, controller.renderModal)

module.exports = router