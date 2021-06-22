for (let i = 0; i < choices.length; i++) {
    const choice = choices[i]
    choice.addEventListener("click", () => {
        document.getElementById("winner").hidden = true
        document.getElementById("spinner").hidden = false

        const type = choice.attributes.getNamedItem("data-type").value
        fetch("/reward/modal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "type": type
            }),
        })
        .then(response => response.text())
        .then(modal => {
            document.getElementById("spinner").hidden = true
            document.getElementById("preview").innerHTML = modal
        })
    })
}