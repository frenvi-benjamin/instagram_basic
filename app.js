require("dotenv").config()
const express = require("express")
const app = express()

const path = require("path")

// qrcode-generator
const QRCode = require("qrcode-svg")

//zip
const zip = require("express-easy-zip")
app.use(zip())

// node-fetch
const fetch = require("node-fetch")
const FormData = require("form-data")

// add body parser to read post body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// mongoose imports
const mongoose = require("mongoose")
mongoose.set("useFindAndModify", false)
mongoose.set("returnOriginal", false)
mongoose.set("debug", true)

const dbHelper = require("./modules/db-helper")

// session
const session = require("express-session")

// use mongodb as session store
const MongoStore = require("connect-mongo")
const { request } = require("express")

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_CONNECTION_URL,
            ttl: 1000 * 60 * 60,
        })
    })
)

// max age of session (1h) {ttl: 1000 * 60 * 60}

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


app.get("/", (req, res) => {

    const defaultRender = function() {
        res.render("index", { instagramAppID: process.env.INSTAGRAM_APP_ID, oauthRedirectURI: process.env.HOST + "/auth" })
    }

    const qrID = req.query.qr
    if (qrID) {
        dbHelper.getConnectedUser(qrID)
        .then(
            user => {
                dbHelper.incrementNrOfScans(user.username)
                res.redirect(`/collab/${user.username}`)
            },
            () => {
                defaultRender()
            }
        )
    }
    else {
        defaultRender()
    }
})

app.get("/collab/:username", (req, res) => {
    const username = req.params.username
    dbHelper.getUserByUsername(username)
    .then(user => dbHelper.updateShortcode(user.accessToken))
    .then(user => {
        res.render("collab", { collabPartner: { username: user.username, shortcode: user.shortcode }})
    })
})

app.get("/auth", (req, res) => {
    const authCode = req.query.code

    const permissionsNotGrantedRender = function() {res.render("request-permissions", { instagramAppID: process.env.INSTAGRAM_APP_ID, oauthRedirectURI: process.env.HOST + "/auth"  })}

    if (!authCode) {
        permissionsNotGrantedRender()
        return
    }

    var formdata = new FormData()
    formdata.append("code", authCode)
    formdata.append("client_id", process.env.INSTAGRAM_APP_ID)
    formdata.append("client_secret", process.env.INSTAGRAM_APP_SECRET)
    formdata.append("grant_type", "authorization_code")
    formdata.append("redirect_uri", process.env.HOST + "/auth")

    var requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
    }
    // get short lived access token with given authentication code
    fetch("https://api.instagram.com/oauth/access_token", requestOptions)
    .then(SLATResponse => SLATResponse.json())
    .then(body => {
        const shortLivedAccessToken = body.access_token
        return shortLivedAccessToken
    })
    // test if user gave access to media
    .then(SLAT => {
        return fetch(`https://graph.instagram.com/me/media?fields=permalink&access_token=${SLAT}`)
        .then(response => response.json())
        .then(body => {
            if (body.error) {
                reject()
            }
            else {
                return SLAT
            }
        })
    })
    .then(
        SLAT => {
            const url = `https://graph.instagram.com/access_token?` +
                `grant_type=ig_exchange_token&` +
                `client_secret=${process.env.INSTAGRAM_APP_SECRET}&` +
                `access_token=${SLAT}`

            fetch(url)
            .then(LLATResponse => LLATResponse.json())
            .then(body => {
                const longLivedAccessToken = body.access_token

                dbHelper.createUserFromAccessToken(longLivedAccessToken)
                .then(user => {
                    req.session.accessToken = user.accessToken
                    req.session.username = user.username
                    req.session.instagramUserID = user.instagramUserID

                    res.redirect("/scanner")
                })
            })
    },
        () => {
            permissionsNotGrantedRender()
        }
    )
})

app.get("/admin", (req, res) => {
    res.render("admin")
})

app.post("/admin/get-user", (req, res) => {
    dbHelper.getUserByUsername(req.body.username)
    .then(user => res.render("admin", { user: user }))
})

app.post("/admin/delete-user", (req, res) => {
    dbHelper.deleteUser(req.body.username)
    res.redirect("/admin")
})

app.post("/admin/clear", (req, res) => {
    dbHelper.clearConnections()
    res.redirect("/admin")
})

app.post("/admin/clear-one", (req, res) => {
    dbHelper.clearConnections(req.body.username)
    res.redirect("/admin")
})

app.post("/admin/create-qrcodes", (req, res) => {
    const n = req.body.nQrcodes
    dbHelper.createQrcodes(n)
    .then(newQrcodes => {
        var files = []

        newQrcodes.forEach(qrcode => {
            const qrID = qrcode._id
            let qrcodeImage = new QRCode({
                content: `${process.env.HOST}?qr=${qrID}`,
                color: req.body.color,
                background: req.body.background,
                join: true // joins all vector graphics paths
            })
            files.push({
                content: qrcodeImage.svg(),
                name: qrID + ".svg",
                date: new Date(),
                type: "file",
            })
        })
        res.zip({
            files: files,
            filename: "qrcodes.zip"
        })
    })
})

app.post("/admin/delete-qrcodes", (req, res) => {
    dbHelper.deleteAllQrcodes()
    res.redirect("/admin")
})

/*########################################################################################################*/
//                                                                                                     /*#*/
// check if user session is initiated this is required for all following routes                        /*#*/
// app.use((req, res, next) => {                                                                          /*#*/
// //                                                                                                     /*#*/
//     if (                                                                                               /*#*/
//         req.session.username                                                                           /*#*/
//     // ||  req.path == "/auth"                                                                         /*#*/
//     // ||  req.path == "/login"                                                                        /*#*/
//     // ||  req.path.match(/\/admin.*/)                                                                 /*#*/
//     // ||  req.path.match(/\/collab.*/)                                                                /*#*/
//     ) { return next() }                                                                                /*#*/
//     else {                                                                                             /*#*/
//         res.redirect("/")                                                                              /*#*/
//     }                                                                                                  /*#*/
// })                                                                                                     /*#*/
//                                                                                                     /*#*/
/*#################### ALL ROUTES BELOW HAVE TO HAVE USER LOGGED IN, IF NOT HE WILL BE REDIRECTED TO ROOT */

app.get("/scanner", (req, res) => {
    res.render("scanner", { instagramUserID: req.session.instagramUserID, accessToken: req.session.accessToken, username: req.session.username })
})

app.post("/connect-qrcode", (req, res) => {
    dbHelper.connectQrcodeToUser(req.body.qrID, req.session.instagramUserID)
    .then(changedModels => res.send(changedModels))
})