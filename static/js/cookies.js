document.getElementById("accept-cookies").addEventListener("click", () => {
    fetch("/accept-cookies")
    const cookies = document.getElementById("cookies")
    cookies.style.opacity = 0
    cookies.style.pointerEvents = "none"
})