async function copy() {
  try {
    // Get the text field
    let text = document.getElementById("referral-link");
    let copyText = text.innerText;

    // Copy the text inside the text field
    await navigator.clipboard.writeText(copyText);
    text.innerText = "Copied"
    
  } catch (error) {
    console.log(error.message)
  }

}
