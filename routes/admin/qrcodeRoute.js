const express = require("express")
const router = express.Router()
const zip = require("express-easy-zip")
router.use(zip())

const controller = require("../../controllers/admin/qrcodeController")

router.post("/create", controller.create)

router.post("/download", controller.download)

router.post("/delete", controller.del)

router.post("/getFiles", controller.getFiles)

module.exports = router