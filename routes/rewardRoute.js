const express = require("express")
const router = express.Router()

const controller = require("../controllers/rewardController")
const sharedController = require("../controllers/sharedController")

router.get("/", sharedController.checkForUserSession, controller.render)

router.post("/modal", sharedController.checkForUserSession, controller.renderModal)

router.post("/set", sharedController.checkForUserSession, controller.setRewardType)

module.exports = router