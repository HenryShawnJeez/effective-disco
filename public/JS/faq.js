//Nav Bar
const btn = document.getElementById("menu-btn");
const nav = document.getElementById("menu");

btn.addEventListener("click", () => [
  btn.classList.toggle("open"),
  nav.classList.toggle("flex"),
  nav.classList.toggle("hidden"),
]);
//For the Questions
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}
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