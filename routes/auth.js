const express = require("express")
const router = express.Router()

const helper = require("../modules/helper")
const fetch = require("node-fetch")
const FormData = require("form-data")

router.get("/auth", (req, res) => {
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

                helper.createUserFromAccessToken(longLivedAccessToken)
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

module.exports = router