require('dotenv').config()
const dbHelper = require('./db-helper')
const fetch = require('node-fetch')

const mediaURL = "https://graph.instagram.com/me/media"
const userURL = "https://graph.instagram.com/me"

function getUsername(accessToken) {
    return fetch(userURL + `?fields=username&access_token=${accessToken}`)
    .then(response => {console.log("USERNAME RESPONSE", response.json()); return response})
    .then(response => {return response.json().username})
}

function getShortcode(accessToken) {
    return fetch(mediaURL + `?fields=permalink&access_token=${accessToken}`)
    .then(res => res.json())
    .then(body => {
        const link = body.data[0].permalink
        // find shortcode
        const pos = link.search("/p/") + 3
        return link.slice(pos, -1)
    })
}

function getID(accessToken) {
    return fetch(userURL + `?access_token=${accessToken}`)
    .then(response => {console.log("ID RESPONSE", response.json()); return response})
    .then(res => {return res.json().id})
}

module.exports = { getShortcode, getUsername, getID }