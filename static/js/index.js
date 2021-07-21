document.getElementById("preview-button").addEventListener("click", () => {
    new bootstrap.Modal(document.getElementById("winner")).show()
})

const publicSwitch = document.getElementById("public-switch")
const switchLabel = document.querySelector("label[for='public-switch']")

const PUBLIC_TEXT = "Öffentlich"
const NOT_PUBLIC_TEXT = "Nicht öffentlich"

// small hack because checked attribute doesn't work on bootstrap switch
if (switchLabel.innerText == PUBLIC_TEXT) {
    publicSwitch.checked = true
}
else {
    publicSwitch.checked = false
}

publicSwitch.addEventListener("click", (e) => {
    if (e.target.checked) {
        switchLabel.innerText = PUBLIC_TEXT
        setPublic(true)
    }
    else {
        switchLabel.innerText = NOT_PUBLIC_TEXT
        setPublic(false)
    }
})

function setPublic(value) {
    fetch("/me/set", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            public: value
        })
    })
}

const deleteAccountButton = document.getElementById("delete-account")
const modal = document.getElementById("delete-account-modal")
deleteAccountButton.addEventListener("click", () => {
    new bootstrap.Modal(modal).show()
})

const confirmDeleteAccount = document.getElementById("confirm-delete-account")
confirmDeleteAccount.addEventListener("click", () => {
    fetch("/me/delete")
    .then(() => logout())
})