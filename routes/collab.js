const express = require("express")
const router = express.Router()

const controller = require("../controllers/collabController")

router.get("/:username", controller.renderCollabPage )

module.exports = router