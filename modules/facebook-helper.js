require('dotenv').config()
const FB = require('fb').default
const userHelper = require('./mongoose-user')



function getLongLivedAccessToken(shortLivedAccessToken, callback) {
    FB.api(
        '/oauth/access_token',
        'GET',
        {
            "grant_type": "fb_exchange_token",
            "client_id": process.env.INSTAGRAM_APP_ID,
            "client_secret": process.env.FACEBOOK_APP_SECRET,
            "fb_exchange_token": shortLivedAccessToken
        },
        function (response) {
            callback(response.access_token)
        }
    )
}

function getCollabPartnerData(userID, callback) {
    var data = {}

    userHelper.getUserByID(userID)
        .then((user) => {
            // get user media, username & profile_picture_url
            FB.api(
                `/${user.instagramUserID}`,
                'GET',
                { "access_token": user.accessToken, "fields": "media,username,profile_picture_url" },
                // then use media id of newest post to get media shortcode
                function (response) {
                    data.username = response.username
                    data.profile_picture_url = response.profile_picture_url
                    const mediaID = response.media.data[0].id

                    FB.api(
                        `/${mediaID}`,
                        'GET',
                        { "access_token": user.accessToken, "fields": "shortcode" },
                        function (response) {
                            data.shortcode = response.shortcode
                            callback(data)
                        }
                    );

                }
            );
        })

}

module.exports = { getLongLivedAccessToken, getCollabPartnerData }