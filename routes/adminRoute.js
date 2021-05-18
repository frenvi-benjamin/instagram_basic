const express = require("express")
const router = express.Router()

const controller = require("../controllers/adminController")

//auth
router.post("/auth", controller.authLogin)

// connections
// needs to be before admin check to allow normal users to connect their 
// qrcodes to their account
router.use("/connection", require("./admin/connectionRoute"))

// check for admin user
router.use(controller.checkAuth)

//  root
router.get("/", (req, res) => {
    res.render("admin")
})

// user
router.use("/user", require("./admin/userRoute"))

// qrcodes
router.use("/qrcode", require("./admin/qrcodeRoute"))

module.exports = router