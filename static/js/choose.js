addEventListener("scroll", () => {
    if (pageYOffset > 400) {
        $("#fixed").show()
    }
    else {
        $("#fixed").hide()
    }
})

function selectPost(id) {
    const imgs = document.getElementsByTagName("img")

    for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i];
        img.classList.remove("selected")
    }

    const selected = document.getElementById(id)
    selected.classList.add("selected")
    document.getElementById("static").click()
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
    const static = document.getElementById("static")

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

    window.location = "/scanner"
}