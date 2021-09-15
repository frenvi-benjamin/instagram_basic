addEventListener("DOMContentLoaded", () => {
    showActiveTab()

    getUser()
})

/**
 * Checks for a hash fragment (https://example.com#here) in the URL
 * and switches to the corresponding tab
 */
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

/**
 * Sends a message to the server to create a number of qrcodes
 * in the database. Stores the qrcode IDs in #fileStore for use later.
 * Also displays the SVGs of the qrcodes in
 * a new .row in the container #create-qrcode.
 * Makes the #download-row visible to the user to make the
 * qrcodes available for download.
 * @param {Number} nQrcodes number of qrcodes to create
 */
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
            fileStore.value += "\"" + file.name.slice(0,-4) + "\""
            if (files.indexOf(file) < files.length - 1) {
                fileStore.value += ", "
            }


            const col = document.createElement("div")
            col.classList.add("col", "qr-col")
            col.innerHTML = file.content
            row.append(col)
        })

        fileStore.value += "]"

        document.getElementById("download-row").removeAttribute("hidden")

    })
}

/**
 * Sends a message to the server to clear the connections
 * between a user and all connected qrcodes. If not given a
 * username clears connections of all users.
 * Displays the server response in the #response-row.
 * @param {String} username Instagram username
 */
function clearConnections(username = undefined) {
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

/**
 * Sends a message to the server to delete all qrcodes
 * connected to the user. If not given a username deletes all
 * qrcodes.
 * Displays the server response in the #response-row.
 * @param {String} username Instagram username
 */
function deleteQrcodes(username = undefined) {
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

/**
 * Gets all or all unused qrcodes from the server and
 * displays them in the #view-row.
 * @param {String} type "all" or "unused"
 */
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
            col.classList.add("col", "qr-col")
            col.innerHTML = file.content
            row.append(col)
        })
    })
}

/**
 * Gets the rendered /views/partials/admin/user-tab/single-user.ejs
 * with the information of a single user.
 * If not given a username gets rendered /views/partials/admin/user-tab/all-users.ejs
 * with the information of all users.
 * Displays the response after the #search-row
 * @param {String} username Instagram username
 */
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

/**
 * Toggles a qrcode from displaying the ID to
 * the SVG and vice versa.
 * @param {Number} qrID ID of the qrcode
 */
function toggleQrcode(qrID) {
    const elem = document.getElementById(qrID)

    switch (elem.getAttribute("data-state")) {
        case "id":
            fetch("/admin/qrcode/getFiles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "type": "one",
                    "one": qrID
                }),
            })
            .then(response => response.json())
            .then(file => {
                elem.innerHTML = file.content
            })
            elem.setAttribute("data-state", "qr")
            break;
    
        case "qr":
            elem.innerHTML = qrID
            elem.setAttribute("data-state", "id")
            break;
    }
}