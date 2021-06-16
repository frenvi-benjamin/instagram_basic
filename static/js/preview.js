const iframe = document.getElementById("iframe")

iframe.addEventListener("load", resizeIframe)
addEventListener("scroll", resizeIframe)

function resizeIframe() {
    iframe.style.height = (iframe.contentWindow.document.body.scrollHeight + 100)+"px"
}