
// =============================
// Scroll Reveal Animation
// =============================

const reveals = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    function (entries, observer) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {

                entry.target.classList.add("active");

                // Stop observing after animation
                observer.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0,
        rootMargin: "0px 0px -80px 0px"
    }
);

reveals.forEach(function (element) {
    revealObserver.observe(element);
});


// =============================
// Video Auto Play / Pause
// =============================

const videos = document.querySelectorAll("video");

const videoObserver = new IntersectionObserver(
    function (entries) {

        entries.forEach(function (entry) {

            const video = entry.target;

            if (entry.isIntersecting) {

                video.play().catch(function () {});

            } else {

                video.pause();

            }

        });

    },
    {
        threshold: 0.3
    }
);

videos.forEach(function (video) {
    videoObserver.observe(video);
});
