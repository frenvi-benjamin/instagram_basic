addEventListener("DOMContentLoaded", () => {
    showActiveTab()

    getUser()
})

function showActiveTab() {
    const hash = location.hash
    if (hash && (
        hash == "#user" ||
        hash == "#create-qrcode" ||
        hash == "#edit-qrcode" ||
        hash == "#view-qrcode" ||
        hash == "#delete-qrcode"
    )) {
        const id = hash.slice(1) + "-tab"
        const button = document.getElementById(id)
        button.click()
    }
}

function createQrcodes(nQrcodes) {
    fetch("/admin/qrcode/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "nQrcodes": nQrcodes
        }),
    })
    .then(response => response.json())
    .then(files => {
        const tabContainer = document.getElementById("create-qrcode")
        const row = document.createElement("div")
        row.classList.add("row")
        tabContainer.append(row)

        fileStore = document.getElementById("fileStore")

        fileStore.value = `[`

        files.forEach(file => {
            fileStore.value += JSON.stringify(file)
            if (files.indexOf(file) < files.length - 1) {
                fileStore.value += ", "
            }


            const col = document.createElement("div")
            col.classList.add("col")
            col.innerHTML = file.content
            row.append(col)
        })

        fileStore.value += "]"

        document.getElementById("download-row").removeAttribute("hidden")

    })
}

function clearConnections(username = undefined) {
    console.log("clearConnection", username)
    fetch("/admin/connection/clear", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": username
        }),
    })
    .then(response => response.text())
    .then(text => {
        document.getElementById("response-row").innerHTML = text
    })
}

function deleteQrcodes(username = undefined) {
    console.log("deleteQrcodes", username)
    fetch("/admin/qrcode/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": username
        }),
    })
    .then(response => response.text())
    .then(text => {
        document.getElementById("response-row").innerHTML = text
    })
}

function getQrcodes(type) {
    switch (type) {
        case "all":
            document.getElementById("refresh-get-all").hidden = false
            document.getElementById("refresh-get-unused").hidden = true
            break;
    
        case "unused":
            document.getElementById("refresh-get-unused").hidden = false
            document.getElementById("refresh-get-all").hidden = true
            break;
    }
    fetch("/admin/qrcode/getFiles", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "type": type
        }),
    })
    .then(response => response.json())
    .then(files => {
        const row = document.getElementById("view-row")
        row.innerHTML = ""
        files.forEach(file => {
            const col = document.createElement("div")
            col.classList.add("col")
            col.innerHTML = file.content
            row.append(col)
        })
    })
}

function getUser(username = undefined) {
    fetch("/admin/user/get", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": username
        }),
    })
    .then(response => response.text())
    .then(text => {
        var userRow
        if (!document.getElementById("userRow")) {
            userRow = document.createElement("div")
            userRow.id = "userRow"
            userRow.classList.add("row")
        }
        else {
            userRow = document.getElementById("userRow")
        }

        userRow.innerHTML = text
        document.getElementById("search-row").after(userRow)
    })
}
