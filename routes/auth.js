const express = require("express")
const router = express.Router()

const controller = require("../controllers/auth")

router.get("/", controller.auth)

module.exports = router