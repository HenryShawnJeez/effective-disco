
const form = document.getElementById("form")
form.addEventListener("submit", function (event) {
    const {plan , amount} = Object.fromEntries([...new FormData(this)])
    if (!plan || !amount) {
        return event.preventDefault()
    }
    if (plan === "essential" && (amount < 100 || amount > 9999) ){
        alert("Invalid Amount")
        event.preventDefault()
    } else if(plan === "capital" && (amount < 10000 || amount > 45000) ){
        alert("Invalid Amount")
        event.preventDefault()
    }else if(plan === "advanced" && (amount < 50000 || amount > 95000) ){
        alert("Invalid Amount")
        event.preventDefault()
    }else if(plan === "ultimate" && (amount < 100000) ){
        alert("Invalid Amount")
        event.preventDefault()
    }
})