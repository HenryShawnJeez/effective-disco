//Top right heading profile
const toggleDropDownBtn = document.querySelector("#toggleDropDownBtn")
toggleDropDownBtn.addEventListener("click", function (e) {
  document.querySelector("#optionBox").classList.toggle("hidden")
})
//Sidebar
function dropDown() {
  document.querySelector('#submenu').classList.toggle('hidden')
  document.querySelector('#arrow').classList.toggle('rotate-180')
}
dropDown()

function Openbar() {
  document.querySelector('.sidebar').classList.toggle('left-[-300px]')
}
//For individual Submenus
const menuIconBalance = document.querySelector("#menuIconBalance")
menuIconBalance.addEventListener("click", function (e) {
  document.querySelector("#balanceMenu").classList.toggle("hidden")
})

const poundsIconEarnings = document.querySelector("#poundsIconEarnings")
poundsIconEarnings.addEventListener("click", function (e) {
  document.querySelector("#poundsMenu").classList.toggle("hidden")
})

const bankIconDeposit = document.querySelector("#bankIconDeposit")
bankIconDeposit.addEventListener("click", function (e) {
  document.querySelector("#depositMenu").classList.toggle("hidden")
})

const moneyIconWithdraw = document.querySelector("#moneyIconWithdraw")
moneyIconWithdraw.addEventListener("click", function (e) {
  document.querySelector("#withdrawMenu").classList.toggle("hidden")
})

//For the eye icons
const eyeIcons = document.querySelectorAll(".eyeIcon");
const numbers = document.querySelectorAll(".number");
const numbers1 = document.querySelectorAll(".number1");

eyeIcons.forEach((eyeIcon, index) => {
  eyeIcon.addEventListener("click", function () {
    const number = numbers[index];
    const number1 = numbers1[index];

    if (number.classList.contains("asterisks")) {
      const originalText = number1.textContent;
      number.textContent = originalText;
      number.classList.remove("asterisks");
      number.classList.add("noasterisks");
      eyeIcon.src = "../Images/eye.png";
    } else if (number.classList.contains("noasterisks")) {
      const originalText = number.textContent.trim();
      const numberOfAsterisks = originalText.substring(2).length;
      const showAsterisks = "*".repeat(numberOfAsterisks);
      number.classList.remove("noasterisks");
      number.classList.add("asterisks");
      number.textContent = showAsterisks;
      eyeIcon.src = "../Images/eyeCrossed.png";
    }
  });
});
