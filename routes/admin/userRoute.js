const express = require("express")
const router = express.Router()

const controller = require("../../controllers/admin/userController")
const sharedController = require("../../controllers/sharedController")

router.use("/set", require("./user/setRoute"))

// check for admin user
router.use(sharedController.checkAdminAuth)

router.post("/get", controller.get)

router.post("/delete", controller.del)

module.exports = router