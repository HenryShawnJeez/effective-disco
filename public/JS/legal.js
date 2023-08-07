//Nav Bar
const btn = document.getElementById("menu-btn");
const nav = document.getElementById("menu");

btn.addEventListener("click", () => [
  btn.classList.toggle("open"),
  nav.classList.toggle("flex"),
  nav.classList.toggle("hidden"),
]);
//For the moving particles
var particles = Particles.init({
  selector: ".background",
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
//For the certificate
const showBtn = document.getElementById('showBtn');
const certificate = document.getElementById('certificate');
showBtn.onclick = () => {
    certificate.classList.toggle("hidden");
}