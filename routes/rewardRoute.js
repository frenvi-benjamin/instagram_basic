const express = require("express")
const router = express.Router()

const controller = require("../controllers/rewardController")

router.get("/", controller.render)
router.post("/modal", controller.renderModal)

module.exports = router