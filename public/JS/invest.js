
const form = document.getElementById("form")
form.addEventListener("submit", function (event) {
    const {plan , amount} = Object.fromEntries([...new FormData(this)])
    if (!plan || !amount) {
        return event.preventDefault()
    }
    if (plan === "essential" && (amount < 100 || amount > 3999) ){
        alert("Invalid Amount")
        event.preventDefault()
    } else if(plan === "capital" && (amount < 4000 || amount > 9999) ){
        alert("Invalid Amount")
        event.preventDefault()
    }else if(plan === "advanced" && (amount < 10000 || amount > 29999) ){
        alert("Invalid Amount")
        event.preventDefault()
    }else if(plan === "ultimate" && (amount < 30000) ){
        alert("Invalid Amount")
        event.preventDefault()
    }
})