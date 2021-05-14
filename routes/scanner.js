const express = require("express")
const router = express.Router()

const controller = require("../controllers/scanner")
const sharedController = require("../controllers/shared")

// user session check middleware
router.use(sharedController.checkForUserSession)
// all routes below require an active session. if no session is active the user will be redirected to the login page

router.get("/scanner", controller.renderScanner)

module.exports = router