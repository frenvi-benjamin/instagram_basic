import QrScanner from "/qr-scanner/qr-scanner.min.js"
QrScanner.WORKER_PATH = "/qr-scanner/qr-scanner-worker.min.js"


const video = document.getElementById("qr-video")
const qrCounter = document.getElementById("qr-counter")
const scanResponseDiv = document.getElementById("scan-response-div")

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
			if (response.status == 200) {
				successfulScans++
				qrCounter.innerHTML = successfulScans
				showResponse(true)
			}
			else if (response.status == 451) {
				showResponse(false)
			}
		})
		alreadyScannedQrcodes.push(qrID)
	}
}

function showResponse(good) {

	const scanResponse = document.createElement("div")
	scanResponse.classList.add("card", "mx-auto", "p-2", "mt-1")

	scanResponseDiv.appendChild(scanResponse)

	if (good) {
		scanResponse.classList.add("good")
		scanResponse.innerHTML = "QR-Code gescannt"
	}
	else {
		scanResponse.classList.add("bad")
		scanResponse.innerHTML = "QR-Code bereits registriert"
	}

	const tl = gsap.timeline()

	tl.eventCallback("onComplete", () => {
		scanResponse.remove()
	})

	tl.to(scanResponse, { duration: 0.5, opacity: 1 })
	tl.to(scanResponse, { duration: 2 })
	tl.to(scanResponse, { duration: 0.5, opacity: 0 })

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