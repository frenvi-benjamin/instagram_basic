// global event listeners

addEventListener("scroll", () => {
    let scrollPosition = window.pageYOffset
    let windowSize     = window.innerHeight
    let bodyHeight     = document.body.offsetHeight

    let distanceFromBottom = Math.max(bodyHeight - (scrollPosition + windowSize), 0)

    if (distanceFromBottom > 100 && pageYOffset > 300) {
        gsap.to(backToTopButton, { duration: 0.2, opacity: 1, pointerEvents: "all" })
    }
    else {
        gsap.to(backToTopButton, { duration: 0.2, opacity: 0, pointerEvents: "none" })
    }
})



// event listeners

const backToTopButton = document.getElementById("back-to-top")
const radioStaticPost = document.getElementById("radio-static-post")
const radioDynamicPost = document.getElementById("radio-dynamic-post")
const previewImages = document.getElementsByClassName("preview-img")
const confirmButtons = document.getElementsByClassName("confirm-button")
const finalConfirmation = document.getElementById("final-confirmation")
const switchButton = document.getElementById("switch-to-dynamic-button")

backToTopButton.addEventListener("click", () => {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
})


radioStaticPost.addEventListener("click", () => {
    setPromotedPost(document.getElementsByClassName("selected")[0])

    document.getElementById("images").hidden = false
})


radioDynamicPost.addEventListener("click", () => {
    setPromotedPost(undefined)

    document.getElementById("images").hidden = true
})


for (let i = 0; i < previewImages.length; i++) {
    const image = previewImages[i];
    image.addEventListener("click", selectPost)
}


// functions

function selectPost(event) {
    removeAllSelections()

    const selected = event.target
    selected.classList.add("selected")

    document.getElementById("radio-static-post").click()
}

function removeAllSelections() {
    const selected = document.getElementsByClassName("selected")
    for (let i = 0; i < selected.length; i++) {
        const sel = selected[i];
        sel.classList.remove("selected")
    }
}
let username
try {
    const username = document.getElementById("campaign-preview").getAttribute("data-username")
} catch {}
var promotedPost
function setPromotedPost(post) {
    promotedPost = post
    const preview = document.getElementById("promoted-post-preview")
    const previewText = document.getElementById("promoted-post-preview-text")

    try {
        if (promotedPost) {
            iframe.src = `/campaign/preview?username=${username}&promotedPost=${promotedPost.getAttribute("data-permalink")}`
        } else {
            iframe.src = `/campaign/preview?username=${username}&promotedPost=undefined`
        }        
    } catch {}

    if (post) {
        try {
            preview.src = post.src
            previewText.hidden = true
        } catch {}

        promotedPost = post.getAttribute("data-permalink")
    }
    else {
        const firstImage = document.getElementsByClassName("preview-img")[0]
        promotedPost = null
        try {
            preview.src = firstImage.src
            previewText.hidden = false
            previewText.innerHTML = "Du hast dich dafür entschieden immer den neusten Post auf deinem Instagram zu promoten.<br>Das ist aktuell dieser:"    
        } catch {}
        
    }
}

try {
    setPromotedPost(document.getElementsByClassName("selected")[0])
} catch {
    const firstImage = document.getElementsByClassName("preview-img")[0]
    firstImage.classList.add("selected")
    setPromotedPost(document.getElementsByClassName("selected")[0])
}

function updatePromotedPost() {
    fetch("/me/set", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            promotedPost: promotedPost
        })
    })
    .then(() => {window.location = "/"})
}

try {
    document.getElementById("update").addEventListener("click", updatePromotedPost)
} catch {}