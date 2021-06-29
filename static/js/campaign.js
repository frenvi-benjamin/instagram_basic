const winner = document.getElementById("winner")
const fireworks = document.getElementsByClassName("stage-container")[0]
let fireworkIntervalID


if (winner && fireworks) {

    addTimeToDisclaimer()

    const intervalID = removeModalAfter30Mins()

    document.getElementById("close-btn").addEventListener("click", () => {
        console.log("user closed modal")
        removeWinnerAndFireworks()
        clearInterval(intervalID)
    })

    if (wonWithin30Mins()) {
        showWinnerModalAndFireworks()
    }
    else {
        console.log("modal not displayed because win time is longer than 30 mins ago")
        removeWinnerAndFireworks()
    }

}

function showWinnerModalAndFireworks() {
    $("#winner").modal({
        backdrop: "static",
        keyboard: false,
    })

    fireworkIntervalID = startFireworks()

    console.log("show winner modal and start fireworks")
}

function removeWinnerAndFireworks() {
    $("#winner").modal("hide")
    try {
        clearInterval(fireworkIntervalID)
    }
    catch (error) {
        console.log(error)
    }
    document.body.removeChild(winner)
    document.body.removeChild(fireworks)
    console.log("removed modal and fireworks")
}

function wonWithin30Mins() {
    return Date.now() - time < (1000*60*30)
}

function removeModalAfter30Mins() {
    const id = setInterval(() => {
        if (!wonWithin30Mins()) {
            console.log("30 mins are over")
            try {
                removeWinnerAndFireworks()
                clearInterval(id)
            } catch {
                clearInterval(id)
            }
        }
    }, 200)
    return id
}

function addTimeToDisclaimer() {
    const locale = new Date(time).toLocaleString("de-DE", { timeZone: "CET" })
    document.getElementById("disclaimer").innerHTML += `<br>(ausgestellt ${locale})`
}