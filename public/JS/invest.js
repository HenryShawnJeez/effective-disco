
const form = document.getElementById("form")
form.addEventListener("submit", function (event) {
    const {plan , amount} = Object.fromEntries([...new FormData(this)])
    if (!plan || !amount) {
        return event.preventDefault()
    }
    if (plan === "cashFlip" && (amount < 200 || amount > 5000) ){
        alert("Invalid Amount")
        event.preventDefault()
    } else if(plan === "basic" && (amount < 100 || amount > 1000) ){
        alert("Invalid Amount")
        event.preventDefault()
    }else if(plan === "standard" && (amount < 500 || amount > 5000) ){
        alert("Invalid Amount")
        event.preventDefault()
    }else if(plan === "essential" && (amount < 1000 || amount > 10000) ){
        alert("Invalid Amount")
        event.preventDefault()
    }else if(plan === "proEssential" && (amount < 5000 || amount > 50000) ){
        alert("Invalid Amount")
        event.preventDefault()
    
    }else if(plan === "premium" && (amount < 10000 || amount > 500000) ){
        alert("Invalid Amount")
        event.preventDefault()
    }
})