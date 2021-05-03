import QrScanner from "/qr-scanner/qr-scanner.min.js"
QrScanner.WORKER_PATH = "/qr-scanner/qr-scanner-worker.min.js"


const video = document.getElementById("qr-video")
const camQrResult = document.getElementById("cam-qr-result")
const camQrResultTimestamp = document.getElementById("cam-qr-result-timestamp")

const qrStatus = document.getElementById("qr-status")

const alreadyScannedQrcodes = []
function alreadyScanned(qrID) {
	return alreadyScannedQrcodes.indexOf(qrID) != -1
}

function onQrScan(result) {
	// show result on label
	camQrResult.textContent = result

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
		fetch(`${host}/connect-qrcode-insta`, {
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
scannerDiv.appendChild(scanner.$canvas);
scanner.$canvas.style.display = "block";
var facingmode = scanner.facingmode
if (scanner.facingmode == "user") {
	scanner.$canvas.style.transform = "scaleX(-1)";
}

const canvas = scanner.$canvas

canvas.style.width = "100%"
canvas.style.borderRadius = "0.25rem"