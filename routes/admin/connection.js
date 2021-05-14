const express = require("express")
const router = express.Router()

const controller = require("../../controllers/admin/connection")

router.post("/clear", controller.clear)

// user session check middleware
// all routes below require an active session. if no session is active the user will be redirected to the login page
router.use(controller.checkForUserSession)

router.post("/create", controller.create)

module.exports = router