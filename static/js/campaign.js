const winner = document.getElementById("winner")
const fireworks = document.getElementsByClassName("stage-container")[0]
let fireworkIntervalID
const VALID_COUPON_TIME = 1000 * 60 * 30
const VALID_COUPON_TIME_MINUTES = VALID_COUPON_TIME / 60 / 1000
let validityIntervalID

if (winner && fireworks) {

    validityIntervalID = setInterval(() => {
        // remove modal and fireworks if VALID_COUPON_TIME_MINUTES mins have passed since the user entered the lottery
        if (!wonWithinValidTime()) {
            console.log(`${VALID_COUPON_TIME_MINUTES} mins are over`)
            try {
                removeWinnerAndFireworks()
                clearInterval(validityIntervalID)
            } catch {
                clearInterval(validityIntervalID)
            }
        }

        // update the time displayed in the disclaimer
        const locale = new Date(time + VALID_COUPON_TIME).toLocaleString("de-DE", { timeZone: "CET" })
        const minutesLeft = Math.ceil(VALID_COUPON_TIME_MINUTES - ((Date.now() - time)/1000/60))
        const disclaimer = document.getElementById("disclaimer")
        if (disclaimer) {
            disclaimer.innerHTML = `Dieser Gutschein ist noch ${minutesLeft} Minuten gültig.<br>(gültig bis ${locale})`
            if (minutesLeft <= 5) {
                disclaimer.style.color = "#DC3545"
                disclaimer.style.fontWeight = "bolder"
            }
        }
    }, 1000);

    document.getElementById("close-btn").addEventListener("click", () => {
        console.log("user closed modal")
        removeWinnerAndFireworks()
        clearInterval(intervalID)
    })

    if (wonWithinValidTime()) {
        showWinnerModalAndFireworks()
    }
    else {
        console.log(`modal not displayed because win time is longer than ${VALID_COUPON_TIME_MINUTES} mins ago`)
        removeWinnerAndFireworks()
    }

}

addEventListener("visibilitychange", () => {
    if (document.visibilityState == "visible") {
        fireworkIntervalID = startFireworks()
    } else {
        stopFireworks()
    }
  })


function showWinnerModalAndFireworks() {
    $("#winner").modal({
        backdrop: "static",
        keyboard: false,
    })

    fireworkIntervalID = startFireworks()

    console.log("show winner modal and start fireworks")
}

function stopFireworks() {
    try {
        clearInterval(fireworkIntervalID)
        fireworkIntervalID = null
    }
    catch (error) {
        console.log(error)
    }
}

function removeWinnerAndFireworks() {
    $("#winner").modal("hide")
    stopFireworks()
    document.body.removeChild(winner)
    document.body.removeChild(fireworks)
    console.log("removed modal and fireworks")
}

function wonWithinValidTime() {
    return Date.now() - time < VALID_COUPON_TIME
}

function addTimeToDisclaimer() {
    const locale = new Date(time + VALID_COUPON_TIME).toLocaleString("de-DE", { timeZone: "CET" })
    document.getElementById("disclaimer").innerHTML += `<br>(gültig bis ${locale})`
}