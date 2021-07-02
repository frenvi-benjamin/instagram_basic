const nextButtons = document.getElementsByClassName("next")
const prevButtons = document.getElementsByClassName("prev")
const title = document.getElementById("title")
const progressBar = document.getElementsByClassName("progress-bar")[0]

for (let i = 0; i < nextButtons.length; i++) {
    const button = nextButtons[i];
    button.addEventListener("click", () => {
        changePage(1)
        window.location = "#header"
    })
}

for (let i = 0; i < prevButtons.length; i++) {
    const button = prevButtons[i];
    button.addEventListener("click", () => {
        changePage(-1)
        window.location = "#header"
    })
}

const pages = [
    {
        id: "choose-page",
        title: "Post auswählen"
    },
    {
        id: "reward-page",
        title: "Goodie auswählen"
    },
    {
        id: "scanner-page",
        title: "QR-Codes scannen"
    },
    {
        id: "preview-page",
        title: "Vorschau der Kampagne"
    }
]

const FIRST_PAGE = 0
const LAST_PAGE = pages.length - 1

var currentPage = FIRST_PAGE

title.innerText = pages[currentPage].title
document.getElementById(pages[currentPage].id).hidden = false

function changePage(nr) {
    const previousPage = currentPage
    currentPage += nr

    // transition title

    const titleTimeline = gsap.timeline()
    titleTimeline.to(title, { duration: 0.25, opacity: 0 })
    titleTimeline.to(title, { duration: 0, innerText: pages[currentPage].title }) 
    titleTimeline.to(title, { duration: 0.25, opacity: 1 })

    // transition content

    const previousContent = document.getElementById(pages[previousPage].id)
    const currentContent = document.getElementById(pages[currentPage].id)

    const contentTimeline = gsap.timeline()
    contentTimeline.to(previousContent, { duration: 0.25, opacity: 0 })
    contentTimeline.to(previousContent, { duration: 0, hidden: true })

    contentTimeline.to(currentContent, { duration: 0, hidden: false })
    contentTimeline.to(currentContent, { duration: 0.25, opacity: 1 })

    // move progress bar

    progressBar.style.width = ((currentPage/LAST_PAGE) * 100) + "%"

    // enable/disable nextButtons

    if (currentPage == LAST_PAGE) {
        for (let i = 0; i < nextButtons.length; i++) {
            const button = nextButtons[i];
            button.disabled = true
        }
    }
    else {
        for (let i = 0; i < nextButtons.length; i++) {
            const button = nextButtons[i];
            button.disabled = false
        }
    }

    // enable/disable prevButtons

    if (currentPage == FIRST_PAGE) {
        for (let i = 0; i < prevButtons.length; i++) {
            const button = prevButtons[i];
            button.disabled = true
        }
    }
    else {
        for (let i = 0; i < prevButtons.length; i++) {
            const button = prevButtons[i];
            button.disabled = false
        }
    }
}