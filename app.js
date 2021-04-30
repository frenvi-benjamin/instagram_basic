require('dotenv').config()
const express = require('express')
const app = express()


// node-fetch
const fetch = require('node-fetch')
const FormData = require('form-data')

// add body parser to read post body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// mongoose imports
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
mongoose.set('returnOriginal', false)

const User = require('./models/user')
const QrCode = require('./models/qrcode')
const dbHelper = require('./modules/db-helper')

// instagram
const instaHelper = require('./modules/instagram-helper')

// set view engine to ejs
app.set('view engine', 'ejs')

// set all paths
app.use('/img', express.static(__dirname + '/static/img'))
app.use('/js', express.static(__dirname + '/static/js'))
app.use('/css', express.static(__dirname + '/static/css'))

app.use('/qr-scanner', express.static(__dirname + '/node_modules/qr-scanner'))
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'))
app.use('/bootstrap-social', express.static(__dirname + '/node_modules/bootstrap-social'))
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'))
app.use('/fontawesome', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free'))

const startServer = app.listen(process.env.PORT, () => {
    console.log(`App listening at ${process.env.HOST}:${process.env.PORT}`)
})

// connect to database
mongoose.connect(process.env.MONGODB_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    // start server when db is connected
    .then((result) => startServer)
    .catch((err) => console.log(err))

app.get('/', (req, res) => {
    const defaultRender = function() {res.render("index", { title: "Login", instagramAppID: process.env.INSTAGRAM_APP_ID, oauthRedirectURI: process.env.HOST + "/auth" })}

    const qrID = req.query.qr
    if (qrID) {
        dbHelper.getConnectedUser(qrID)
        .then((user) => {
            if (user) {
                res.redirect('/collab?_id=' + user._id)
            }
            else {
                defaultRender()
            }
        })
    }
    else {
        defaultRender()
    }
})

app.get('/collab', (req, res) => {
    if (req.query._id) {
        const userID = req.query._id

        instaHelper.getCollabPartnerData(userID, (collabPartnerData) => {
            res.render("collab", { title: "Collab", collabPartner: collabPartnerData})
        })
    }
})

app.get('/auth', (req, res) => {
    const authCode = req.query.code

    const defaultRender = function (user) {res.render("auth", { title: "Authentication", accessToken: user.accessToken, instagramUserID: user.instagramUserID })}
    const permissionsNotGrantedRender = function() {res.render("request-permissions", { instagramAppID: process.env.INSTAGRAM_APP_ID, oauthRedirectURI: process.env.HOST + "/auth"  })}

    if (!authCode) {
        permissionsNotGrantedRender()
        return
    }

    console.log("authCode", authCode)
    console.log("client_id", process.env.INSTAGRAM_APP_ID)
    console.log("client_secret", process.env.INSTAGRAM_APP_SECRET)
    console.log("redirect_uri", process.env.HOST + "/auth")

    var formdata = new FormData()
    formdata.append("code", authCode)
    formdata.append("client_id", process.env.INSTAGRAM_APP_ID)
    formdata.append("client_secret", process.env.INSTAGRAM_APP_SECRET)
    formdata.append("grant_type", "authorization_code")
    formdata.append("redirect_uri", process.env.HOST + "/auth")

    var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    }
    // get short lived access token with given authentication code
    fetch("https://api.instagram.com/oauth/access_token", requestOptions)
    .then(SLATResponse => SLATResponse.json())
    .then(body => {
        const shortLivedAccessToken = body.access_token
        console.log("SLAT: ", shortLivedAccessToken)
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

            console.log("URL to exchange SLAT for LLAT: ", url)

            fetch(url)
            .then(LLATResponse => LLATResponse.json())
            .then(body => {
                const longLivedAccessToken = body.access_token
                console.log("LLAT: ", longLivedAccessToken)

                dbHelper.createUserFromAccessToken(longLivedAccessToken)
                .then((user) => defaultRender(user))
            })
    },
        () => {
            permissionsNotGrantedRender()
        }
    )
})

app.post('/scanner-insta', (req, res) => {
    res.render("scanner-insta", { title: "QR-Scanner", instagramUserID: req.body.instagramUserID, accessToken: req.body.accessToken })
})


app.post('/connect-qrcode-insta', (req, res) => {
    // get qrcode by qrID
    QrCode.where("_id").equals(req.body.qrID)
    .then(qrcodeResponse => {
        var qrcode = qrcodeResponse[0]
    // get current user
        User.where("instagramUserID").equals(req.body.instagramUserID)
        .then(userResponse => {
            var user = userResponse[0]
            // add only if not already present
            user.qrcodes.addToSet(qrcode._id)
            qrcode.connectedUser = user._id

            user.save()
            qrcode.save()

            return {"qrcode": qrcode, "user": user}
        })
        .then((changedModels) => res.send(JSON.stringify(changedModels)))
    })
})

app.get('/admin', (req, res) => {
    res.render("admin", { title: "Admin" })
})

app.post('/admin/clear', (req, res) => {
    dbHelper.clearConnections()
    res.redirect('/admin')
})

app.post('admin/clear-one', (req, res) => {
    dbHelper.clearConnections(req.body.username)
    res.redirect('/admin')
})