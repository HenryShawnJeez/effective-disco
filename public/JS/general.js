// Nav Bar Toggle
const btn = document.getElementById("menu-btn");
const nav = document.getElementById("menu");
const closeIcon = document.getElementById("close");
const openIcon = document.getElementById("open");

btn.addEventListener("click", () => {
  // Toggle button open state
  btn.classList.toggle("open");

  // Toggle visibility of icons
  closeIcon.classList.toggle("hidden");
  openIcon.classList.toggle("hidden");

  // Toggle navigation menu visibility
  nav.classList.toggle("flex");
  nav.classList.toggle("hidden");
});
