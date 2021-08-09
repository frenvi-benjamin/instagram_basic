_iOSDevice = !!navigator.platform.match(/iPhone|iPod|iPad/);

document.querySelectorAll(".white-bars>span").forEach(element => {
    element.style.lineHeight = 2.4
})