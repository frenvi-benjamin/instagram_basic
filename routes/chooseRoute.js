const express = require("express")
const router = express.Router()

const controller = require("../controllers/chooseController")
const sharedController = require("../controllers/sharedController")


router.get("/", sharedController.checkForUserSession, controller.render)

module.exports = router