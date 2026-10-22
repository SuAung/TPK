document.addEventListener("DOMContentLoaded", function () {
  var hero = document.querySelector(".hero");
  if (!hero) return;

  var slides = Array.from(hero.querySelectorAll(".hero-slide"));
  var indicators = Array.from(hero.querySelectorAll(".progress-item"));
  var currentSlideText = document.getElementById("current-slide");
  var previousButton = hero.querySelector(".previous-slide");
  var nextButton = hero.querySelector(".next-slide");
  var menuToggle = document.querySelector(".menu-toggle");
  var siteNav = document.querySelector(".site-nav");

  if (!slides.length) return;

  var activeIndex = 0;
  var intervalDuration = 3500;
  var timer = null;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var autoPlay = !reducedMotion;

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
      var isActive = i === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", isActive ? "false" : "true");
    });

    indicators.forEach(function (button, i) {
      var isActive = i === activeIndex;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    if (currentSlideText) {
      currentSlideText.textContent = String(activeIndex + 1).padStart(2, "0");
    }

    restartTimer();
  }

  function stopTimer() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
    hero.classList.remove("is-playing");
  }

  function startTimer() {
    stopTimer();
    if (!autoPlay || slides.length < 2) return;

    // Restart the active progress bar animation whenever the timer starts.
    void hero.offsetWidth;
    hero.classList.add("is-playing");
    timer = window.setInterval(function () {
      showSlide(activeIndex + 1);
    }, intervalDuration);
  }

  function restartTimer() {
    startTimer();
  }

  if (previousButton) {
    previousButton.addEventListener("click", function () {
      showSlide(activeIndex - 1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", function () {
      showSlide(activeIndex + 1);
    });
  }

  indicators.forEach(function (button, index) {
    button.addEventListener("click", function () {
      showSlide(index);
    });
  });

  // Pause the slideshow while visitors hover over or focus inside the hero.
  hero.addEventListener("mouseenter", stopTimer);
  hero.addEventListener("mouseleave", startTimer);
  hero.addEventListener("focusin", stopTimer);
  hero.addEventListener("focusout", function (event) {
    if (!hero.contains(event.relatedTarget)) startTimer();
  });

  // Respect browser-level reduced-motion preferences.
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stopTimer();
    else startTimer();
  });

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        siteNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      });
    });
  }

  showSlide(0);
});
