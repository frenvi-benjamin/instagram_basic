const userHelper = require('./mongoose-user')
const fetch = require('node-fetch')

function getUserByInstagramAccessToken(accessToken) {
    return fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`)
    .then(response => response.json())
    .then(body => {
        console.log(body)
        const instagramUserID = body.id
        return userHelper.getUserByInstagramUserID(instagramUserID)
        .then(user => {return user})
    })
}

module.exports = { getUserByInstagramAccessToken }