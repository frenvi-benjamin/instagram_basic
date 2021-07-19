const changePostButton = document.getElementById("change-post")

changePostButton.addEventListener("click", ()=> {
    jumpToPageById("choose-post-page")
})

const preview = document.getElementById("campaign-preview")
const publishButton = document.getElementById("publish-button")
const closePreviewButton = document.getElementById("close-preview-button")
const showPreviewButton = document.getElementById("show-preview-button")

closePreviewButton.addEventListener("click", hidePreview)
showPreviewButton.addEventListener("click", showPreview)
publishButton.addEventListener("click", publishCampaign)

const iframe = document.createElement("iframe")
iframe.frameBorder = 0

function hidePreview() {
    const tl = gsap.timeline()
    tl.to(preview, { duration: 0.25, opacity: 0 })
    tl.to(preview, { duration: 0, hidden: true })
    document.querySelector("#campaign-preview > iframe").remove()
    document.body.style.overflow = "visible"
}

function showPreview() {
    document.getElementById("campaign-preview").prepend(iframe)
    const tl = gsap.timeline()
    tl.to(preview, { duration: 0, hidden: false })
    tl.to(preview, { duration: 0.25, opacity: 1 })
    document.body.style.overflow = "hidden"
}

function publishCampaign() {
    fetch("/me/set", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "public": true,
            "promotedPost": promotedPost,
            "rewardType": rewardType,
        }),
    })
    .then(new bootstrap.Modal(document.getElementById("publish-modal")).show())
}