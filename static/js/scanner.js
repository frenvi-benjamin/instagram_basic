import QrScanner from "/qr-scanner/qr-scanner.min.js"
QrScanner.WORKER_PATH = "/qr-scanner/qr-scanner-worker.min.js"


const video = document.getElementById("qr-video")
const qrCounter = document.getElementById("qr-counter")
const scanResponse = document.getElementById("scan-response")

const alreadyScannedQrcodes = []
var successfulScans = 0
function alreadyScanned(qrID) {
	return alreadyScannedQrcodes.indexOf(qrID) != -1
}

function onQrScan(result) {
	// find qr code ID
	const pos = result.search("qr=") + 3
	const qrID = result.slice(pos)

	// if not scanned, connect qrcode to user
	if (!alreadyScanned(qrID)) {
		fetch("/admin/connection/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				"qrID": qrID
			}),
		})
		.then(response => {
			if (response.status == 200) scanSuccessful()
			else if (response.status == 451) scanUnsuccessful()
		})
		alreadyScannedQrcodes.push(qrID)
	}
}

function scanSuccessful() {
	successfulScans++
	qrCounter.innerHTML = successfulScans
	showResponse(true, "QR-Code gescannt", 2000)
}

function scanUnsuccessful() {
	showResponse(false, "QR-Code bereits registriert", 2500)
}

function showResponse(good, message, time) {
	scanResponse.innerHTML = message
	if (good) {
		scanResponse.style.color = "#A2D208"
		scanResponse.style.borderColor = "#A2D208"
	}
	else {
		scanResponse.style.color = "#DC3545"
		scanResponse.style.borderColor = "#DC3545"
	}

	fadeIn(scanResponse)
	setTimeout(() => fadeOut(scanResponse), time)
	

}

function fadeIn(elem) {
	var opacity = 0
	const id = setInterval(() => {
		if (opacity >= 1) clearInterval(id)
		else {
			opacity += .1
			elem.style.opacity = opacity
			console.log("var", opacity)
			console.log("true", elem.style.opacity)
		}
	}, 15);
}

function fadeOut(elem) {
	var opacity = 1
	const id = setInterval(() => {
		if (opacity <= 0) clearInterval(id)
		else {
			opacity -= .1
			elem.style.opacity = opacity
		}
	}, 15);
}

// ####### Web Cam Scanning #######

const scanner = new QrScanner(
	video,
	(result) => onQrScan(result),
	() => {}
)

scanner.start()

const scannerDiv = document.getElementById("scanner")
const canvas = scanner.$canvas
canvas.classList.add("rounded")
canvas.classList.add("mx-0")
scannerDiv.appendChild(canvas)


var observer = new MutationObserver((mutationsList) => {
	mutationsList.forEach(mutation => {
		canvas.style.transform = video.style.transform
	});
})

observer.observe(video, { attributes : true, attributeFilter : ["style"] })