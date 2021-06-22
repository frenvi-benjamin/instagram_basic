const radioDynamic = document.getElementById("radio-dynamic-post")
const radioStatic = document.getElementById("radio-static-post")
const confirmDynamic = document.getElementById("confirm-dynamic-post")
const linkToChoose = document.getElementById("link-to-choose")

radioDynamic.addEventListener("click", () => {
    linkToChoose.hidden = true
    confirmDynamic.hidden = false
})

radioStatic.addEventListener("click", () => {
    confirmDynamic.hidden = true
    linkToChoose.hidden = false
})

confirmDynamic.addEventListener("click", () => {
    fetch("/admin/user/set/promotedPost", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mediaID: "reset"
        })
    })
    .then(() => {
        document.getElementById("done").hidden = false
        setTimeout(() => {document.getElementById("done").hidden = true}, 2000)
    })
})