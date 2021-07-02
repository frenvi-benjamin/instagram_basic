// global event listeners

addEventListener("scroll", () => {
    let scrollPosition = window.pageYOffset
    let windowSize     = window.innerHeight
    let bodyHeight     = document.body.offsetHeight

    let distanceFromBottom = Math.max(bodyHeight - (scrollPosition + windowSize), 0)

    let backToTopButton = document.getElementById("back-to-top")

    if (distanceFromBottom > 100 && pageYOffset > 300) {
        gsap.to(backToTopButton, { duration: 0.2, opacity: 1, pointerEvents: "all" })
    }
    else {
        gsap.to(backToTopButton, { duration: 0.2, opacity: 0, pointerEvents: "none" })
    }
})



// event listeners

const radioStaticPost = document.getElementById("radio-static-post")
const radioDynamicPost = document.getElementById("radio-dynamic-post")
const previewImages = document.getElementsByClassName("preview-img")
const confirmButtons = document.getElementsByClassName("confirm-button")
const finalConfirmation = document.getElementById("final-confirmation")
const switchButton = document.getElementById("switch-to-dynamic-button")

radioStaticPost.addEventListener("click", () => {
    // document.getElementById("static-post-text").hidden = false
    // document.getElementById("dynamic-post-text").hidden = true

    document.getElementById("images").hidden = false
})

radioDynamicPost.addEventListener("click", () => {
    removeAllSelections()

    // document.getElementById("static-post-text").hidden = true
    // document.getElementById("dynamic-post-text").hidden = false

    document.getElementById("images").hidden = true
})

for (let i = 0; i < previewImages.length; i++) {
    const image = previewImages[i];
    image.addEventListener("click", selectPost)
}

for (let i = 0; i < confirmButtons.length; i++) {
    const button = confirmButtons[i];
    button.addEventListener("click", confirmChoice)
}

// finalConfirmation.addEventListener("click", sendConfirmation)

// switchButton.addEventListener("click", () => {
//     document.getElementById("radio-dynamic-post").click()
//     confirmChoice()
// })

// functions

function selectPost(event) {
    const imgs = document.getElementsByTagName("img")

    for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i];
        img.classList.remove("selected")
    }

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

function confirmChoice() {
    const selectedPost = document.getElementsByClassName("selected")[0]
    const static = document.getElementById("radio-static-post")

    if (static.checked && !selectedPost) {
        return $("#noPostSelectedModal").modal({
            backdrop: "static",
            keyboard: false,
        })
    }
    
    const finalImg = document.getElementById("final-img")

    if (static.checked) {
        finalImg.src = selectedPost.src
        finalImg.setAttribute("data-id", selectedPost.id)
    }
    else {
        finalImg.src = document.getElementsByClassName("preview-img")[0].src
        finalImg.setAttribute("data-id", undefined)
    }
    
    $("#confirmationModal").modal({
        backdrop: "static",
        keyboard: false,
    })
}

function sendConfirmation() {
    const id = document.getElementById("final-img").getAttribute("data-id")

    fetch("/admin/user/set/promotedPost", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mediaID: id
        })
    })

    window.location = "/reward"
}