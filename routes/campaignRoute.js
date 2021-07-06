const express = require("express")
const router = express.Router()

const controller = require("../controllers/campaignController")

router.get("/preview", controller.renderPreview)

router.get("/:username", controller.checkUserExistance, controller.checkPublicity, controller.render)

module.exports = router