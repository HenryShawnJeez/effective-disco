function copy() {
    // Get the text field
    var text = document.getElementById("wallet");
    var copyText = text.innerText;
  
     // Copy the text inside the text field
    navigator.clipboard.writeText(copyText);
  
    // Alert the copied text
    alert("You copied the text: " + copyText + " to your clipboard");
  }