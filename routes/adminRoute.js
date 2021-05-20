const express = require("express")
const router = express.Router()

const controller = require("../controllers/adminController")
const sharedController = require("../controllers/sharedController")

//auth
router.post("/auth", controller.authLogin)

// connections
// needs to be before admin check to allow normal users to connect their 
// qrcodes to their account
router.use("/connection", require("./admin/connectionRoute"))

// user
// needs to be before admin check to allow normal users to set 
// their promoted posts
router.use("/user", require("./admin/userRoute"))

// check for admin user
router.use(sharedController.checkAdminAuth)

//  root
router.get("/", (req, res) => {
    res.render("admin")
})

// qrcodes
router.use("/qrcode", require("./admin/qrcodeRoute"))

module.exports = router