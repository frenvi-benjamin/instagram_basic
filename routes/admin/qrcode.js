const express = require("express")
const router = express.Router()
const zip = require("express-easy-zip")
router.use(zip())

const controller = require("../../controllers/admin/qrcode")

router.post("/create", controller.create)

router.post("/download", controller.download)

router.post("/delete", controller.del)

module.exports = router