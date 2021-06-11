function logout() {
    fetch("/logout")
    .then(res => res.text())
    .then(res => document.body.innerHTML = res)
}