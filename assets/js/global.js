document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Determine base path for includes
        // Check if we're in /products/ subdirectory or root
        const currentPath = document.location.pathname;
        const basePath = currentPath.includes('/products/') ? '../' : './';

        // Load header
        const headerResponse = await fetch(`${basePath}includes/header.html`);
        if (headerResponse.ok) {
            const headerData = await headerResponse.text();
            const headerElement = document.getElementById('header');
            if (headerElement) {
                headerElement.innerHTML = headerData;
                // Add ARIA label for accessibility
                const nav = headerElement.querySelector('nav');
                if (nav) nav.setAttribute('aria-label', 'Main navigation');

                // Initialize hamburger menu
                initializeHamburgerMenu();
            }
        } else {
            console.warn('Failed to load header');
        }

        // Load footer
        const footerResponse = await fetch(`${basePath}includes/footer.html`);
        if (footerResponse.ok) {
            const footerData = await footerResponse.text();
            const footerElement = document.getElementById('footer');
            if (footerElement) {
                footerElement.innerHTML = footerData;
                footerElement.setAttribute('role', 'contentinfo');
            }
        } else {
            console.warn('Failed to load footer');
        }
    } catch (error) {
        console.error('Error loading includes:', error);
    }
});

// Hamburger Menu Toggle
function initializeHamburgerMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (!menuToggle || !nav) return;

    // Hide menu initially on mobile
    if (window.innerWidth <= 768) {
        nav.classList.add('hidden');
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    // Toggle menu on button click
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');

        menuToggle.setAttribute(
            'aria-expanded',
            nav.classList.contains('active')
        );
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.add('hidden');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        const isMenuButton = event.target.closest('.menu-toggle');
        const isNav = event.target.closest('nav');

        if (!isMenuButton && !isNav && !nav.classList.contains('hidden')) {
            menuToggle.classList.remove('active');
            nav.classList.add('hidden');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !nav.classList.contains('hidden')) {
            menuToggle.classList.remove('active');
            nav.classList.add('hidden');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Lazy load images for performance optimization
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                }
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'  // Start loading 50px before image comes into view
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        img.classList.add('lazy-loading');
        imageObserver.observe(img);
    });
}

// Add fade-in animation for loaded images
const style = document.createElement('style');
style.textContent = `
    img.lazy-loading {
        opacity: 0.5;
        transition: opacity 0.3s ease;
    }
    img.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);

