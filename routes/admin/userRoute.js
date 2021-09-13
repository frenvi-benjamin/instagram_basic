const express = require("express")
const router = express.Router()

const controller = require("../../controllers/admin/userController")
const sharedController = require("../../controllers/sharedController")

router.post("/get", sharedController.checkAdminAuth, controller.get)

router.post("/delete", sharedController.checkAdminAuth, controller.del)

module.exports = router