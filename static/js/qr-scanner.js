import QrScanner from "/qr-scanner/qr-scanner.min.js"
QrScanner.WORKER_PATH = "/qr-scanner/qr-scanner-worker.min.js"


const video = document.getElementById("qr-video")

const qrStatus = document.getElementsByClassName("qr-status")
console.log(qrStatus)

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
		for (let i = 0; i < qrStatus.length; i++) {
			const status = qrStatus[i];
			status.innerHTML = "QR-Code gescannt!"
			status.style.backgroundColor = "#A2D208"
			status.style.color = "white"
		}
	}
	// if not scanned, connect qrcode to user
	else {
		fetch("/connection/create", {
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
		for (let i = 0; i < qrStatus.length; i++) {
			const status = qrStatus[i];
			status.innerHTML = "Kein QR-Code gefunden"
			status.style.backgroundColor = "white"
			status.style.color = "black"
		}
	}
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