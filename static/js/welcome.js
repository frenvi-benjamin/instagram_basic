animateStep3()
animateStep4()

function concat() {
    let output = ""
    for (let i = 0; i < arguments.length; i++) {
        if (i == arguments.length-1) {
            output += arguments[i]
        }
        else {
            output += arguments[i] + ", "
        }
    }
    return output
}

function animateStep3() {
    const qrcodeGroup = '*[data-name="reg-qrcode-group"]'
    const tick = '*[data-name="reg-tick"]'
    const border = '*[data-name="reg-border"]'
    const scanBars = '*[data-name="reg-scan-bars"]'
    const insta = '*[data-name="reg-insta"]'

    gsap.set(concat(qrcodeGroup, border, tick, insta), { transformOrigin: "50% 50%" })

    tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5})

    tl.to(insta, { duration: 0.5, opacity: 1 })

    tl.fromTo(qrcodeGroup, { x: -2000, scale: 2 }, { x: -300, scale: 2, ease: "power4.out" })

    tl.fromTo(qrcodeGroup, { x: -300, scale: 2 }, { x: 0, scale: 1, duration: 1, ease: "power2.inOut" })

    tl.from(border, { duration: 0.5, opacity: 0, scale: 1.2, ease: "power2.inOut"}, "-=0.25")

    tl.to(scanBars, { duration: 1, y: 475, ease: "power2.inOut" })

    tl.from(insta, { duration: 1, y: 150, ease: "power2.inOut" })

    tl.to(insta, { duration: 0.5, opacity: 0 }, "-=0.3")

    tl.from(tick, { duration: 0.5, opacity: 0, scale: 2, ease: "power4.out"})

    tl.to(border, { duration: 0.5, opacity: 0, scale: 1.2, ease: "power2.inOut"}, "+=0.25")

    tl.to(qrcodeGroup, { duration: 0.5, opacity: 0 }, "-=0.5")

    tl.to(tick, { duration: 0, opacity: 0 })
    console.log(tl.duration())
}

function animateStep4() {
    const qrcodeSmall = '*[data-name="usr-qrcode-sm"]'
    const qrcodeLarge = '*[data-name="usr-qrcode-lg"]'
    const border = '*[data-name="usr-border"]'
    const scanBars = '*[data-name="usr-scan-bars"]'
    const campaignView = '*[data-name="usr-campaign-view"]'
    const scanView = '*[data-name="usr-scan-view"]'
    const logo = '*[data-name="usr-logo"]'
    const x = '*[data-name="usr-x"]'
    const du = '*[data-name="usr-du"]'

    gsap.set(concat(qrcodeSmall, qrcodeLarge, border, scanBars, campaignView, scanView, logo, x, du), { transformOrigin: "50% 50%"})

    tl = gsap.timeline({ repeat: -1 })

    tl.from(concat(qrcodeSmall, qrcodeLarge), { duration: 1, x: -2000, ease: "back.out(0.8)" })

    tl.from(border, {duration: 0.5, opacity: 0, scale: 1.2, ease: "power2.inOut"}, "-=0.25")

    tl.to(scanBars, { duration: 1, y: 475, ease: "power2.inOut" })

    tl.to(scanView, { duration: 0.5, opacity: 0, ease: "power2.inOut" })
    
    tl.to(logo, { duration: 0, y: -150, ease: "power2.inOut" })

    tl.to(logo, { duration: 0.5, opacity: 1, ease: "power2.inOut" })

    tl.from(logo, { duration: 1, y: -150, ease: "power2.inOut" })
    tl.from(du, { duration: 1, y: 100, ease: "power2.inOut" }, "-=1")
    
    tl.to(du, { duration: 0.5, opacity: 1, ease: "power2.inOut" }, "-=0.7")

    tl.to(x, { duration: 0.5, opacity: 1, ease: "power2.inOut" }, "-=0.5")

    tl.to({}, { duration: 1.75 })

    tl.to(concat(logo, x, du), { duration: 0.5, opacity: 0 })

    tl.to(qrcodeLarge, { duration: 1, x: 2000, ease: "back.in(0.8)" }, "-=1.5")
    console.log(tl.duration())
}