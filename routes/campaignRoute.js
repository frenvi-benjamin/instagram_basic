const express = require("express")
const router = express.Router()

const controller = require("../controllers/campaignController")

router.get("/preview", controller.renderPreview)

router.get("/:username", controller.renderCampaignPage)

module.exports = router