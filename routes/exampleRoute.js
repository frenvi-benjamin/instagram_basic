const express = require("express")
const router = express.Router()

const controller = require("../controllers/exampleController")

router.use("/", controller.renderExample)

module.exports = router