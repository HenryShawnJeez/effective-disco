myFunction = () => {
  const x = document.getElementById("myPassword");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
  const eye = document.getElementById("eye");
  eye.classList.toggle("fa-eye-slash");
}
myFunction1 = () => {
  const y = document.getElementById("myPassword1");
  if (y.type === "password") {
    y.type = "text";
  } else {
    y.type = "password";
  }
  const eye1 = document.getElementById("eye1");
  eye1.classList.toggle("fa-eye-slash");
}

//For the moving particles
var particles = Particles.init({
  selector: ".background",
  color: "#D4AF37",
  maxParticles: 100,
  sizeVariations: 7,
  connectParticles: true,
  responsive: [
    {
      breakpoint: 768,
      options: {
        maxParticles: 50,
        sizeVariations: 2,
        connectParticles: true,
      },
    },
  ],
});

//For the Form
//Checking the passwords
function checkPasswordMatch() {
  const passwordInput = document.getElementById('myPassword');
  const confirmPasswordInput = document.getElementById('myPassword1');
  const notification = document.getElementById('notification');
  const submitBtn = document.getElementById('submit');

  if (passwordInput.value !== confirmPasswordInput.value) {
    notification.classList.remove("hidden");
    notification.classList.add("flex");
    submitBtn.disabled = true;
    submitBtn.classList.contains('cursorPointer')
  ? (submitBtn.classList.remove('cursorPointer'), submitBtn.classList.add("cursorDisallowed"))
  : submitBtn.classList.add("cursorDisallowed")
  } else{
    notification.classList.remove("flex");
    notification.classList.add("hidden");
    submitBtn.disabled = false;
    submitBtn.classList.contains('cursorDisallowed')
  ? (submitBtn.classList.remove('cursorDisallowed'), submitBtn.classList.add("cursorPointer"))
  : submitBtn.classList.add("cursorPointer")
  }
}


//Clicking on the X function
const hide = () => {
  const notification = document.getElementById("notification")
  notification.classList.add("hidden")
}
//Rewrite Password Function
const correctPassword = () => {
  const passwordInput = document.getElementById("myPassword")
  const confirmPasswordInput = document.getElementById("myPassword1")
  passwordInput.value = '';
  confirmPasswordInput.value = '';
  passwordInput.focus();
  hide()
}
//Password Strength
const pwd = document.getElementById("myPassword");
const pwdStrength = document.getElementById("password-strength");

pwd.addEventListener("input", function () {
  const pwdVal = pwd.value;
  let result = zxcvbn(pwdVal);  
  pwdStrength.className += "strength-" + result.score + " ";  
});
//Checking if the passwords is correct or not
const confirmPasswordInput = document.getElementById('myPassword1');
confirmPasswordInput.addEventListener('input', checkPasswordMatch);