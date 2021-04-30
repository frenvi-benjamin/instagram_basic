require('dotenv').config()
const dbHelper = require('./db-helper')
const fetch = require('node-fetch')

const mediaURL = "https://graph.instagram.com/me/media"
const userURL = "https://graph.instagram.com/me"

function getCollabPartnerData(userID, callback) {
    var data = {}

    dbHelper.getUserByID(userID)
    .then(user => {
        // get username
        return fetch(userURL + `?fields=username&access_token=${user.accessToken}`)
        .then(response => response.json())
        .then(body => { data.username = body.username })
        .then(() => { return user })
    })
    .then(user => {
        // get shortcode of 
        return fetch(mediaURL + `?fields=permalink&access_token=${user.accessToken}`)
        .then(response => response.json())
        .then(body => {
            const link = body.data[0].permalink
            // find shortcode
            const pos = link.search("/p/") + 3
            data.shortcode = link.slice(pos, -1)
        })
    })
    .then(() => callback(data))
}

module.exports = { getCollabPartnerData }