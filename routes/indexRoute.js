const express = require("express")
const router = express.Router()

const controller = require("../controllers/indexController")

router.use(controller.checkForActiveQrcode)

router.get("/", controller.renderIndex)

module.exports = router