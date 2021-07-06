const express = require("express")
const router = express.Router()

const controller = require("../controllers/meController")

router.get("/", controller.get)

router.post("/set", controller.set)

module.exports = router