const express = require("express")
const router = express.Router()

const controller = require("../../controllers/admin/connectionController")
const sharedController = require("../../controllers/sharedController")

router.post("/clear", sharedController.checkAdminAuth, controller.clear)

// user session check middleware
// all routes below require an active session. if no session is active the user will be redirected to the login page
router.use(sharedController.checkForUserSession)

// make sure qrcode is not already connected to a user 
router.post("/create", controller.assureUnusedQrcode, controller.create)

module.exports = router