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
  color: "#FDFDFD",
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
