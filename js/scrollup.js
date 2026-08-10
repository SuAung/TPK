const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    } else {
      entry.target.classList.remove('active');
    }
  });
}, {
  threshold: 0.2
});

reveals.forEach(el => observer.observe(el));

/* Video autoplay when visible */

const video = document.getElementById('tpkVideo');

const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      video.play();     // auto-play when visible
    } else {
      video.pause();    // pause when not visible
    }
  });
}, {
  threshold: 0.6   // 60% visible triggers play
});

videoObserver.observe(video);
