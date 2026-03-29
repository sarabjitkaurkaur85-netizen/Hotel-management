document.addEventListener("DOMContentLoaded", () => {
    const carousels = document.querySelectorAll("[data-carousel]");

    carousels.forEach((carousel) => {
        const viewport = carousel.querySelector(".carousel-viewport");
        const track = carousel.querySelector(".carousel-track");
        const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
        const prevButton = carousel.querySelector(".carousel-btn-prev");
        const nextButton = carousel.querySelector(".carousel-btn-next");
        const autoplayDelay = Number(carousel.dataset.autoplay) || 0;
        const desktopSlides = Number(carousel.dataset.desktopSlides) || 3;
        const tabletSlides = Number(carousel.dataset.tabletSlides) || 2;
        const mobileSlides = Number(carousel.dataset.mobileSlides) || 1;

        if (!viewport || !track || slides.length === 0 || !prevButton || !nextButton) {
            return;
        }

        let currentIndex = 0;
        let slidesPerView = 1;
        let slideWidth = 0;
        let maxIndex = 0;
        let autoplayTimer = null;

        const getSlidesPerView = () => {
            if (window.innerWidth >= 1100) {
                return desktopSlides;
            }

            if (window.innerWidth >= 700) {
                return tabletSlides;
            }

            return mobileSlides;
        };

        const moveTo = (index, animate = true) => {
            if (!animate) {
                track.style.transition = "none";
            }

            track.style.transform = `translateX(-${index * slideWidth}px)`;

            if (!animate) {
                window.requestAnimationFrame(() => {
                    track.style.transition = "";
                });
            }
        };

        const layoutSlides = () => {
            slidesPerView = getSlidesPerView();
            slideWidth = viewport.clientWidth / slidesPerView;
            maxIndex = Math.max(0, slides.length - slidesPerView);

            if (currentIndex > maxIndex) {
                currentIndex = 0;
            }

            slides.forEach((slide) => {
                slide.style.width = `${slideWidth}px`;
            });

            moveTo(currentIndex, false);
        };

        const showNext = () => {
            currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
            moveTo(currentIndex);
        };

        const showPrev = () => {
            currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
            moveTo(currentIndex);
        };

        const stopAutoplay = () => {
            if (autoplayTimer) {
                window.clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        };

        const startAutoplay = () => {
            if (autoplayDelay <= 0) {
                return;
            }

            stopAutoplay();
            autoplayTimer = window.setInterval(showNext, autoplayDelay);
        };

        prevButton.addEventListener("click", showPrev);
        nextButton.addEventListener("click", showNext);

        carousel.addEventListener("mouseenter", stopAutoplay);
        carousel.addEventListener("mouseleave", startAutoplay);
        carousel.addEventListener("focusin", stopAutoplay);
        carousel.addEventListener("focusout", startAutoplay);

        window.addEventListener("resize", layoutSlides);

        layoutSlides();
        startAutoplay();
    });
});
