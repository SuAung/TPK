// ===============================
// Modern Hero Slider
// Pure JavaScript
// ===============================

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

let current = 0;
let autoPlay;

// -------------------------------
// Show Slide
// -------------------------------

function showSlide(index) {

    // Wrap around

    if (index >= slides.length)
        index = 0;

    if (index < 0)
        index = slides.length - 1;

    // Remove active class

    slides.forEach(slide => {
        slide.classList.remove("active");
    });

    dots.forEach(dot => {
        dot.classList.remove("active");
    });

    // Add active class

    slides[index].classList.add("active");
    dots[index].classList.add("active");

    current = index;
}

// -------------------------------
// Next Slide
// -------------------------------

function nextSlide() {

    showSlide(current + 1);

}

// -------------------------------
// Previous Slide
// -------------------------------

function prevSlide() {

    showSlide(current - 1);

}

// -------------------------------
// Auto Play
// -------------------------------

function startAutoPlay() {

    stopAutoPlay();

    autoPlay = setInterval(() => {

        nextSlide();

    }, 4000);

}

function stopAutoPlay() {

    clearInterval(autoPlay);

}

// -------------------------------
// Buttons
// -------------------------------

nextBtn.addEventListener("click", () => {

    nextSlide();

    startAutoPlay();

});

prevBtn.addEventListener("click", () => {

    prevSlide();

    startAutoPlay();

});

// -------------------------------
// Dots
// -------------------------------

dots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

        showSlide(index);

        startAutoPlay();

    });

});

// -------------------------------
// Keyboard Support
// -------------------------------

document.addEventListener("keydown", (e) => {

    if (e.key === "ArrowRight") {

        nextSlide();

        startAutoPlay();

    }

    if (e.key === "ArrowLeft") {

        prevSlide();

        startAutoPlay();

    }

});

// -------------------------------
// Pause when mouse enters
// -------------------------------

const hero = document.querySelector(".hero");

hero.addEventListener("mouseenter", stopAutoPlay);

hero.addEventListener("mouseleave", startAutoPlay);

// -------------------------------
// Initialize
// -------------------------------

showSlide(0);

startAutoPlay();

