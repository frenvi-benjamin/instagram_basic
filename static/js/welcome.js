gsap.set("#qrcode, #border", { transformOrigin: "50% 50%" })

tl = gsap.timeline({ repeat: -1})

tl.from("#qrcode", { duration: 1, x: -300, scale: 2, ease: "power2.inOut"})

tl.from("#border", { duration: 0.5, opacity: 0, scale: 1.2, ease: "power2.inOut"}, "-=0.25")

tl.to("#scan-bars", { duration: 1, y: 475 })

tl.to("#border", { duration: 0.5, opacity: 0, scale: 1.2, ease: "power2.inOut"})

tl.to("#qrcode", { duration: 1, x: 300, scale: 2, ease: "power2.inOut"}, "-=0.25")

tl.to("#qrcode", { duration: 1, x: 1000, scale: 2, ease: "power2.inOut"})

tl.to("#qrcode", { duration: 0, opacity: 0, x: -1000 })

tl.to("#qrcode", { duration: 0, opacity: 1})

tl.to("#qrcode", { duration: 1, x: -300, scale: 2, ease: "power2.inOut"})