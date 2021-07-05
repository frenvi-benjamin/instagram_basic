const TYPE_CUP_OF_ICE_CREAM = 1
const TYPE_EXTRA_CREAM = 2
const TYPE_EXTRA_SCOOP = 3
const TYPE_SURPRISE = 4

fetch("/reward/get")
.then(response => response.json())
.then(user => {
    switch (user.rewardType) {
        case TYPE_CUP_OF_ICE_CREAM:
            document.getElementById("choice1").checked = true
            setRewardType(user.rewardType)
            break;
        case TYPE_EXTRA_CREAM:
            document.getElementById("choice2").checked = true
            setRewardType(user.rewardType)
            break;
        case TYPE_EXTRA_SCOOP:
            document.getElementById("choice3").checked = true
            setRewardType(user.rewardType)
            break;
        case TYPE_SURPRISE:
            document.getElementById("choice4").checked = true
            setRewardType(user.rewardType)
            break;
    }
})

const choices = document.getElementsByName("reward")

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

var rewardType

function setRewardType(type) {
    rewardType = type
    const preview =  document.getElementById("goodie-preview-text")
    switch (type) {
        case TYPE_CUP_OF_ICE_CREAM:
            preview.innerHTML = "eine Kugel Eis im Becher mit unserem EATlery&copy; Löffel."
            break;
        case TYPE_EXTRA_CREAM:
            preview.innerHTML = "eine extra Portion Sahne auf ihr Eis."
            break;
        case TYPE_EXTRA_SCOOP:
            preview.innerHTML = "eine Kugel Eis extra."
            break;
        case TYPE_SURPRISE:
            preview.innerHTML = "eine Überraschung. Du suchst selbst aus was deine Kunden erhalten."
            break;
    }
}