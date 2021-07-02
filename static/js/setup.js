const nextButtons = document.getElementsByClassName("next")
const prevButtons = document.getElementsByClassName("prev")
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

const pages = document.getElementsByClassName("setup-content-page")

const FIRST_PAGE = 0
const LAST_PAGE = pages.length - 1

var currentPage = FIRST_PAGE

pages[currentPage].hidden = false

function changePage(nr) {
    const previousPage = currentPage
    currentPage += nr

    // transition content

    const contentTimeline = gsap.timeline()
    contentTimeline.to(pages[previousPage], { duration: 0.25, opacity: 0 })
    contentTimeline.to(pages[previousPage], { duration: 0, hidden: true })

    contentTimeline.to(pages[currentPage], { duration: 0, hidden: false })
    contentTimeline.to(pages[currentPage], { duration: 0.25, opacity: 1 })

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