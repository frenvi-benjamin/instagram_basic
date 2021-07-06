const express = require("express")
const router = express.Router()

router.use((req, res) => res.render("error", { title: "404", message: "Die gesuchte Seite kann nicht gefunden werden."}))

module.exports = router