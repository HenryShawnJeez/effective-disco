function displayLoader() {
    const btn = document.querySelector('.load');
    console.log(btn);

    const html = `
    <span class="spinner"></span>
    `

    btn.disabled = true
    btn.insertAdjacentHTML("afterbegin", html)
}