const express = require("express")
const router = express.Router()

const controller = require("../controllers/scannerController")
const sharedController = require("../controllers/sharedController")

// user session check middleware
// all routes below require an active session. if no session is active the user will be redirected to the login page
router.get("/", sharedController.checkForUserSession, controller.renderScanner)

module.exports = router