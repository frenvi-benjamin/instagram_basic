const iframe = document.getElementById("iframe")

setInterval(resizeIframe, 1000);

function resizeIframe() {
    iframe.style.height = (iframe.contentWindow.document.body.scrollHeight + 100)+"px"
}