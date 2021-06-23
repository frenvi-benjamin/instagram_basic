try {
    const winner = document.getElementById("winner")
    const then = Date.now()

    const id = setInterval(() => {
        if (Date.now() - then > 10000) {
            try {
                $("#winner").modal("hide")
                document.body.removeChild(winner)
                clearInterval(id)
            } catch {
                clearInterval(id)
            }
        }
    }, 1000)
} catch {}