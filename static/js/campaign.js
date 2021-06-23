try {
    const winner = document.getElementById("winner")

    const id = setInterval(() => {
        if (Date.now() - time > 1800000) {
            try {
                $("#winner").modal("hide")
                document.body.removeChild(winner)
                clearInterval(id)
            } catch {
                clearInterval(id)
            }
        }
    }, 60000)
} catch {}