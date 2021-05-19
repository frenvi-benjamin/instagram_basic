function selectPost(id) {
    const imgs = document.getElementsByTagName("img")

    for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i];
        img.classList.remove("selected")
    }

    document.getElementById(id).classList.add("selected")
}