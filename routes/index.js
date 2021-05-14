const express = require("express")
const router = express.Router()

const controller = require("../controllers/index")

router.use(controller.checkForActiveQrcode)

router.get("/", controller.renderIndex)

module.exports = router