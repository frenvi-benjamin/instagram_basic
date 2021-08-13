const winner = document.getElementById("winner")
const fireworks = document.getElementsByClassName("stage-container")[0]
let fireworkIntervalID
const THIRTY_MINUTES = 1000 * 60 * 30

if (winner && fireworks) {

    addTimeToDisclaimer()

    const intervalID = setInterval(() => {
        // remove modal and fireworks if 30 mins have passed since the user entered the lottery
        if (!wonWithin30Mins()) {
            console.log("30 mins are over")
            try {
                removeWinnerAndFireworks()
                clearInterval(id)
            } catch {
                clearInterval(id)
            }
        }

        // update the time displayed in the disclaimer
        const locale = new Date(time + THIRTY_MINUTES).toLocaleString("de-DE", { timeZone: "CET" })
        const minutesLeft = Math.round(30 - ((Date.now() - time)/1000/60))
        const disclaimer = document.getElementById("disclaimer")
        disclaimer.innerHTML = `Dieser Gutschein ist noch ${minutesLeft} Minuten gültig.<br>(gültig bis ${locale})`
        if (minutesLeft <= 5) {
            disclaimer.style.color = "#DC3545"
            disclaimer.style.fontWeight = "bolder"
        }
    }, 1000);

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
    return Date.now() - time < THIRTY_MINUTES
}

function addTimeToDisclaimer() {
    const locale = new Date(time + THIRTY_MINUTES).toLocaleString("de-DE", { timeZone: "CET" })
    document.getElementById("disclaimer").innerHTML += `<br>(gültig bis ${locale})`
}