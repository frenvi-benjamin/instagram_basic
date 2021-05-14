const express = require("express")
const router = express.Router()

//  root
router.get("/", (req, res) => {
    res.render("admin")
})

// user
router.use("/user", require("./admin/user"))

// connections
router.use("/connection", require("./admin/connection"))

// qrcodes
router.use("/qrcode", require("./admin/qrcode"))

module.exports = router