const express = require("express")
const router = express.Router()

const controller = require("../controllers/adminController")
const sharedController = require("../controllers/sharedController")
const User = require("../models/userModel")

//auth
router.post("/auth", controller.authLogin)

//  root
router.get("/", sharedController.checkAdminAuth, (req, res) => {
    res.render("admin")
})

// connections
router.use("/connection",sharedController.checkAdminAuth,  require("./admin/connectionRoute"))

// user
router.use("/user", sharedController.checkAdminAuth, require("./admin/userRoute"))

// qrcodes
router.use("/qrcode", sharedController.checkAdminAuth, require("./admin/qrcodeRoute"))

module.exports = router