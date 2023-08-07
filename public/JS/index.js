//Nav Bar
const btn = document.getElementById("menu-btn");
const nav = document.getElementById("menu");

btn.addEventListener("click", () => [
  btn.classList.toggle("open"),
  nav.classList.toggle("flex"),
  nav.classList.toggle("hidden"),
]);

// For The Animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("unhide");
    }
  });
});
const hiddenElements = document.querySelectorAll(".hide");
hiddenElements.forEach((el) => observer.observe(el));

// For the Automatic typing happening on the Page.
var typed = new Typed(".auto-type", {
  strings: ["Secure,", "Strategise And,", "Maximise,"],
  smartBackspace: true,
  typeSpeed: 120,
  backSpeed: 140,
  loop: true,
  showCursor: true,
  cursorChar: "|",
  autoInsertCss: true,
});

//Second
const headingArray = ["Diversity", "Clarity", "Advancement", "Assistance", "Fluidity", "Affordability","Simplicity", "Protection" ];
const subHeadingArray = ["Wide Investment Range", "Transparent Investment", "Innovative Tools", "Dedicated Support",  "High Liquidity", "Competitive Fees", "User-friendly Interface" ,"Security Measure"]
const paragraphArray = ["Emphasizing the wide range of investment options available on the platform, investors can explore and diversify their portfolio across various cryptocurrencies, ensuring greater flexibility and potential for higher returns.", 
"Transparency is a core principle of our platform. With clear and open reporting on investment performance and real-time data, investors can make informed decisions with confidence and understand their investments better.", 
"We pride ourselves on providing innovative tools and technologies to our users. Through advanced analytics, predictive models, and cutting-edge trading algorithms, investors can stay ahead of the curve and make smarter investment choices.", 
"Our dedicated support team is always ready to help. We offer personalized assistance to guide investors throughout their investment journey, ensuring they receive the necessary help and support at every step.",
"High liquidity is a hallmark of our platform. Investors can enjoy quick and efficient transactions, enabling them to enter and exit positions with ease and flexibility.", 
"We strive to offer competitive fees to our users. With transparent fee structures and low transaction costs, investors can optimize their returns and keep more of their earnings.", 
"Our user-friendly interface is designed to make the investment process easy and straightforward. Whether you're a beginner or an experienced investor, navigating the platform and executing trades is a seamless experience.", 
"Security is of utmost importance to us. With robust and multi-layered security measures, we ensure that our users' assets are protected from potential threats and unauthorized access, allowing them to invest with peace of mind."];


const circles = document.querySelectorAll(".circle");
const shineDuration = 4000; // 4 seconds
let currentCircle = 0;

function shineNextCircle() {
  circles[currentCircle].classList.add("shining");
  setTimeout(() => {
    circles[currentCircle].classList.remove("shining");
    currentCircle = (currentCircle + 1) % circles.length;
    const midHeading = document.getElementById("midHeading");
    const midSubheading = document.getElementById("midSubheading");
    const midParagraph = document.getElementById("midParagraph");

    // The Change in texts
    midHeading.textContent = headingArray[currentCircle];
    midSubheading.textContent = subHeadingArray[currentCircle];
    midParagraph.textContent = paragraphArray[currentCircle];
    setTimeout(shineNextCircle, 0);
  }, shineDuration);
}

shineNextCircle();



//Testimonial Section
var swiper = new Swiper(".mySwiper", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
  },
  pagination: {
    el: ".swiper-pagination",
    dynamicBullets: true,
  },
});

