const express = require("express")
const router = express.Router()

const controller = require("../../controllers/admin/connectionController")
const sharedController = require("../../controllers/sharedController")

router.post("/clear", sharedController.checkAdminAuth, controller.clear)

module.exports = router