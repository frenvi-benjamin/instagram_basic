/*

Helper module for a few common tasks

*/

require("dotenv").config()

// database models
const User = require("../models/userModel")

// fetch
const fetch = require("node-fetch")

// instagram api urls
const mediaURL = "https://graph.instagram.com/me/media"
const oembedURL = "https://graph.facebook.com/v11.0/instagram_oembed"

// INSTAGRAM

/**
 * Get the newest post of any Instagram user via their username.
 * @param {String} username username of the user whose newest post to get
 * @returns newest Instagram post of the given user
 */
function getNewestPost(username) {
    return User.findOne({ username: username })
    .then(user => {
        return fetch(mediaURL + `?fields=permalink&access_token=${user.accessToken}`)
        .then(response => response.json())
        .then(media => {
            return media.data[0]
        })
    })
}

/**
 * Gets the permalink of a user's Instagram media (post)
 * @param {Integer} mediaID ID of the Instagram media (post)
 * @param {String} accessToken Instagram access token of the media's user
 * @returns {String} permalink of the media
 */
function getPostPermalink(mediaID, accessToken) {
    return fetch(`https://graph.instagram.com/${mediaID}?fields=permalink&access_token=${accessToken}`)
    .then(response => response.json())
    .then(body => body.permalink)
}

/**
 * Gets the Instagram oEmbed of the post that the user
 * has chosen as the post to promote on our campaign.
 * @param {String} username Instagram username
 * @returns {String} Instagram oEmbed of that user's promoted post
 */
function getOembed(username) {

    if (!username) return Promise.reject()

    
    return User.findOne({ username: username })
    .then(user => {
        if (user.promotedPost) {
            return buildOembed(user.promotedPost, username != "eatleryforfuture")
        }
        else {
            return fetch(mediaURL + `?fields=permalink&access_token=${user.accessToken}`)
            .then(response => response.json())
            .then(body => buildOembed(body.data[0].permalink, username != "eatleryforfuture"))
        }
    })
    
}

/**
 * 
 * @param {String} promotedPost URL of the user's chosen post to promote
 * @param {Boolean} caption wether to show the caption of the post in the oEmbed
 * @returns {String} the HTML of the Instagram oEmbed
 */
function buildOembed(promotedPost, caption) {
    return fetch(oembedURL + `?url=${promotedPost}&hidecaption=${caption.toString()}&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`)
    .then(response => response.json())
    .then(body => body.html)
}

// DATABASE

/**
 * Refreshes the Instagram access tokens of all users in the database.
 */
function refreshAccessTokens() {
    User.find({}, "accessToken")
    .then(users => {
        users.forEach(user => {
            fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${user.accessToken}`)
            .then(response => response.json())
            .then(body => {
                User.findOneAndUpdate({accessToken: user.accessToken}, { accessToken: body.access_token }).exec()
            })
        })
    })
}

module.exports = {
    getNewestPost,
    getOembed,
    buildOembed,
    refreshAccessTokens,
    getPostPermalink,
}