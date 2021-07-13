const express = require("express")
const router = express.Router()

const controller = require("../controllers/choosePostController")
const sharedController = require("../controllers/sharedController")


router.get("/", sharedController.checkForUserSession, controller.render)

module.exports = router