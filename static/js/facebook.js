var instagramUserID
var facebookPageID

function afterLogin(loginResponse) {
    if (loginResponse.status != 'connected') return
    console.log("login response", loginResponse)
    accessToken = loginResponse.authResponse.accessToken

    // get facebook page ID
    FB.api(
        '/me/accounts',
        'GET',
        { "access_token": accessToken, "fields": "id, access_token" },
        getinstagramUserID
    )
}

function getinstagramUserID(response) {

    console.log("facebook response", response)

    facebookPageID = response.data[0].id
    const accessToken = response.data[0].accessToken

    FB.api(
        `/${facebookPageID}`,
        'GET',
        { "access_token": accessToken, "fields": "instagram_business_account, access_token" },
        addUser
    )
}

function getProfilePicture(response) {

    console.log("instagram response", response)

    instagramUserID = response.instagram_business_account.id

    FB.api(
        `/${instagramUserID}`,
        'GET',
        {"fields": "profile_picture_url"},
        function (response) {
            console.log(response)

            let profilePic = document.createElement("img")
            profilePic.src = response.profile_picture_url

            document.body.appendChild(profilePic)
        }
    )

}

function addUser(response) {
    var instagramUserID = response.instagram_business_account.id


    const form = document.getElementById("form")
    const instaInput = document.getElementById("instaInput")
    const facebookInput = document.getElementById("facebookInput")
    const accessToken = document.getElementById("accessToken")

    instaInput.value = instagramUserID
    facebookInput.value = facebookPageID
    accessToken.value = response.access_token

    form.submit()
}