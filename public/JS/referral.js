// const { default: swal } = require("sweetalert");

async function copy() {
  try {
    // Get the text field
    var text = document.getElementById("referral-link");
    var copyText = text.innerText;

    // Copy the text inside the text field
    await navigator.clipboard.writeText(copyText);
    text.innerText = "Copied"


    // Alert the copied text
    // alert("You copied the text: " + copyText + " to your clipboard");
  } catch (error) {
    console.log(error.message)
  }

}
