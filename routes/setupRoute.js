const express = require("express")
const router = express.Router()

const controller = require("../controllers/setupConstroller")
const sharedController = require ("../controllers/sharedController")

router.use("/", sharedController.checkForUserSession, controller.render)

module.exports = router