const express = require("express")
const router = express.Router()

const controller = require("../controllers/chooseController")
const sharedController = require("../controllers/sharedController")

router.use(sharedController.checkForUserSession)

router.get("/", controller.render)

module.exports = router