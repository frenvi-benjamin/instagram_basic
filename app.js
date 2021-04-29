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
const User = require('./models/user')
const QrCode = require('./models/qrcode')
const qrcodeHelper = require('./modules/mongoose-qrcode')
const userHelper = require('./modules/mongoose-user')

// facebook
const fbHelper = require('./modules/facebook-helper')

//instagram
const instaHelper = require('./modules/instagram-helper')
const { render } = require('ejs')

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

app.get('/test', (req, res) => {
    qrcodeHelper.getConnectedUser("608835a56fd6e4eface893c7")
    .then((user) => res.send(user))
    
})

app.get('/', (req, res) => {
    const defaultRender = function() {res.render("index", { title: "Login", instagramAppID: process.env.INSTAGRAM_APP_ID, oauthRedirectURI: process.env.HOST + "/auth" })}

    const qrID = req.query.qr
    if (qrID) {
        qrcodeHelper.getConnectedUser(qrID)
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

        fbHelper.getCollabPartnerData(userID, function (collabPartnerData) {
            res.render("collab", { title: "Collab", collabPartner: collabPartnerData})
        })
    }
    // collabPartnerData = {
    //     username: "eismanufakturzeitgeist",
    //     profilePicURL: "https://scontent-frx5-1.cdninstagram.com/v/t51.2885-19/s320x320/45817360_313316495944356_1062492746306027520_n.jpg?tp=1&_nc_ht=scontent-frx5-1.cdninstagram.com&_nc_ohc=BuCF9k_I_TwAX8mhQYq&edm=ABfd0MgAAAAA&ccb=7-4&oh=08b9c32b75d84ad95c951ee288d752fc&oe=60A4523C&_nc_sid=7bff83",
    //     shortcode: "CLjWK7vn_T4"
    // }
})

app.get('/auth', (req, res) => {
    const authCode = req.query.code

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

    fetch("https://api.instagram.com/oauth/access_token", requestOptions)
    .then(SLATResponse => SLATResponse.json())
    .then(jsonSLAT => {
        console.log("SLAT json", jsonSLAT)
        const shortLivedAccessToken = jsonSLAT.access_token
        console.log("SLAT: ", shortLivedAccessToken)

        const url = `https://graph.instagram.com/access_token?` +
        `grant_type=ig_exchange_token&` +
        `client_secret=${process.env.INSTAGRAM_APP_SECRECT}&` +
        `access_token=${shortLivedAccessToken}`

        console.log("URL to exchange SLAT for LLAT: ", url)

        fetch(url)
        .then(LLATResponse => LLATResponse.json())
        .then(jsonLLAT => {
            console.log("LLAT json", jsonLLAT)
            const longLivedAccessToken = jsonLLAT.access_token
            console.log("LLAT: ", longLivedAccessToken)

            instaHelper.getUserByInstagramAccessToken(longLivedAccessToken)
            .then((user) => {
                user.accessToken = longLivedAccessToken
                user.save()

                res.render("auth", )
            })

        })
    })

})

app.post('/scanner', (req, res) => {
    console.log(req.body)
    // const instagramUserID = req.body.instagramUserID
    // const facebookPageID = req.body.facebookPageID
    // const shortLivedAccessToken = req.body.accessToken


    // fbHelper.getLongLivedAccessToken(shortLivedAccessToken, function(longLivedAccessToken) {
    //     // callback after getting longLivedAccessToken

    //     // check for existig user
    //     userHelper.getUserByFacebookPageID(facebookPageID)
    //     .then((user) => {
    //         // add new user if non-existant
    //         if (!user) {

    //             const user = new User({
    //                 instagramUserID: instagramUserID,
    //                 facebookPageID: facebookPageID,
    //                 accessToken: longLivedAccessToken
    //             })
    //             user.save()
    //                 .then((newlyCreatedUser) => res.render("scanner", { title: "QR-Scanner", user: newlyCreatedUser }))
    //         }
    //         // if user already exists update token and render scanner
    //         else {

    //             user.accessToken = longLivedAccessToken
    //             user.save()
    //             res.render("scanner", { title: "QR-Scanner", user: user })
    //         }
    //     })
    // })
})

app.post('/connect-qrcode', (req, res) => {
    // get qrcode by qrID
    QrCode.where("_id").equals(req.body.qrID)
        .exec()
    .then((qrcodeResponse) => {
        var qrcode = qrcodeResponse[0]
    // get current user
        User.where("instagramUserID").equals(req.body.instagramUserID)
            .where("facebookPageID").equals(req.body.facebookPageID)
            .exec()
        .then((userResponse) => {
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