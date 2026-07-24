document.addEventListener("DOMContentLoaded", function() {
    const slides = document.querySelectorAll(".slide");
    if (slides.length === 0) return;
    
    let currentIndex = 0;
    let autoplayInterval;
    
    // Initialize: show first slide
    function showSlide(index) {
        slides.forEach((slide, i) => {
            const isActive = i === index;
            slide.classList.toggle('active', isActive);
            slide.setAttribute('aria-hidden', !isActive);
        });
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }
    
    // Autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 4000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Initialize slideshow
    showSlide(currentIndex);
    startAutoplay();
    
    // Pause autoplay on hover (accessibility + UX)
    const slideshowElement = document.querySelector('.slideshow');
    if (slideshowElement) {
        slideshowElement.addEventListener('mouseenter', stopAutoplay);
        slideshowElement.addEventListener('mouseleave', startAutoplay);
    }
    
    // Allow keyboard navigation (accessibility)
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight') {
            nextSlide();
            stopAutoplay();
            startAutoplay();
        } else if (event.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(currentIndex);
            stopAutoplay();
            startAutoplay();
        }
    });
});

