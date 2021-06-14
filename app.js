require("dotenv").config()
const express = require("express")
const app = express()

const path = require("path")

// add body parser to read post body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// mongoose imports
const mongoose = require("mongoose")
mongoose.set("returnOriginal", false)
mongoose.set("debug", true)
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// helper module
const helper = require("./modules/helper")

helper.getUser("eatleryforfuture")
.then(user => {
    if (!user) throw Error("Application needs the eatleryforfuture account in DB to run properly")
})

// session
const session = require("express-session")

// use mongodb as session store
const MongoStore = require("connect-mongo")

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_CONNECTION_URL,
        }),
        cookie: { maxAge: 1000 * 60 * 60 * 24 * 14 } // 14 days
    })
)


// set view engine to ejs
app.set("view engine", "ejs")

// set all paths
app.use("/img", express.static(path.join(__dirname, "/static/img")))
app.use("/js", express.static(path.join(__dirname, "/static/js")))
app.use("/css", express.static(path.join(__dirname, "/static/css")))

app.use("/qr-scanner", express.static(path.join(__dirname, "/node_modules/qr-scanner")))
app.use("/bootstrap", express.static(path.join(__dirname, "/node_modules/bootstrap/dist")))
app.use("/bootstrap-social", express.static(path.join(__dirname, "/node_modules/bootstrap-social")))
app.use("/jquery", express.static(path.join(__dirname, "/node_modules/jquery/dist")))
app.use("/fontawesome", express.static(path.join(__dirname, "/node_modules/@fortawesome/fontawesome-free")))

const startServer = app.listen(process.env.PORT, () => {
    console.log(`App listening at ${process.env.HOST}:${process.env.PORT}`)
})

// connect to database
mongoose.connect(process.env.MONGODB_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
// start server when db is connected
.then(() => startServer)
.catch((err) => console.log(err))

// refresh tokens every 24.855 days (maximum)
helper.refreshAccessTokens()
setInterval(helper.refreshAccessTokens, 2147483647)

app.locals.env = process.env

const sharedController = require("./controllers/sharedController")

app.use(sharedController.auth)

// index
app.use("/", require("./routes/indexRoute"))

// example
app.use("/example", require("./routes/exampleRoute"))

// admin
app.use("/admin", require("./routes/adminRoute"))

// campaign
app.use("/campaign", require("./routes/campaignRoute"))

//scanner
app.use("/scanner", require("./routes/scannerRoute"))

//choose
app.use("/choose", require("./routes/chooseRoute"))

//preview
app.use("/preview", require("./routes/previewRoute"))

const ejs = require("ejs")

//logout
app.use("/logout", (req, res) => {
    req.session.destroy()
    ejs.renderFile(path.join(__dirname, "/views/logout.ejs"), { env: process.env})
    .then(rendered => res.send(rendered))
})

const base64url = require("base64url")
const User = require("./models/userModel")

// deauthorization (instagram)
app.use("/deauthorize", (req, res) => {
    res.sendStatus(200)
})

// data deletion (instagram)
app.use("/delete-data", (req, res) => {
    const request = req.body.signed_request
    const decodedPayload = base64url.decode(request[1])
    User.findOneAndDelete({ instagramUserID: decodedPayload.user_id }).exec()
    res.sendStatus(200)
})

app.use(require("./routes/404Route"))