const express = require("express")
const router = express.Router()

const controller = require("../controllers/auth")

router.get("/auth", controller.auth)

module.exports = router