const iframe = document.getElementById("iframe")

setInterval(resizeIframe, 1000);

addEventListener("resize", resizeIframe)

function resizeIframe() {
    iframe.style.height = (iframe.contentWindow.document.body.scrollHeight + 50)+"px"
}