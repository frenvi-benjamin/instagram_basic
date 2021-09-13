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

// stats
router.get("/:username", sharedController.checkAdminAuth, sharedController.checkForUserSession, (req, res) => {
    User.findOne({ username: req.params.username }, "scans")
    .then(user => res.render("stats", { scans: user.scans }))
})

// connections
router.use("/connection",sharedController.checkAdminAuth,  require("./admin/connectionRoute"))

// user
router.use("/user", sharedController.checkAdminAuth, require("./admin/userRoute"))

// qrcodes
router.use("/qrcode", sharedController.checkAdminAuth, require("./admin/qrcodeRoute"))

module.exports = router