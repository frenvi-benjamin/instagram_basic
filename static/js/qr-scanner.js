import QrScanner from "/qr-scanner/qr-scanner.min.js"
QrScanner.WORKER_PATH = "/qr-scanner/qr-scanner-worker.min.js"


const video = document.getElementById("qr-video")

const qrStatus = document.getElementById("qr-status")

const alreadyScannedQrcodes = []
function alreadyScanned(qrID) {
	return alreadyScannedQrcodes.indexOf(qrID) != -1
}

function onQrScan(result) {
	// find qr code ID
	const pos = result.search("qr=") + 3
	const qrID = result.slice(pos)

	// check if already scanned this session
	if (alreadyScanned(qrID)) {
		qrStatus.innerHTML = "QR-Code gescannt!"
		qrStatus.style.backgroundColor = "#A2D208"
		qrStatus.style.color = "white"
	}
	// if not scanned, connect qrcode to user
	else {
		fetch("/connect-qrcode", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				"instagramUserID": instagramUserID,
				"qrID": qrID
			}),
		})
		alreadyScannedQrcodes.push(qrID)
	}

	if (!alreadyScanned(qrID)) {
		alreadyScannedQrcodes.push(qrID)
		console.log(alreadyScannedQrcodes)
	}

}

// ####### Web Cam Scanning #######

const scanner = new QrScanner(
	video,
	(result) => onQrScan(result),
	(error) => {
		qrStatus.innerHTML = "Kein QR-Code gefunden"
		qrStatus.style.backgroundColor = "white"
		qrStatus.style.color = "black"
	}
)

scanner.start()

const scannerDiv = document.getElementById("scanner")
const canvas = scanner.$canvas
scannerDiv.appendChild(canvas)


var observer = new MutationObserver((mutationsList) => {
	mutationsList.forEach(mutation => {
		canvas.style.transform = video.style.transform
	});
})

observer.observe(video, { attributes : true, attributeFilter : ["style"] })

canvas.style.display = "block"
canvas.style.maxWidth = "500px"
canvas.classList.add("mx-auto")
canvas.style.width = "100%"
canvas.style.borderRadius = "0.25rem"