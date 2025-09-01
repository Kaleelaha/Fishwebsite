// Home page specific functionality

// Initialize featured fish section
function initFeaturedFish() {
    const featuredFishGrid = document.getElementById('featured-fish-grid');
    if (!featuredFishGrid) return;
    
    // Get first 6 fish for featured section
    const featuredFish = fishData.slice(0, 6);
    
    featuredFishGrid.innerHTML = featuredFish.map(fish => createFishCard(fish)).join('');
    
    // Add staggered animation to cards
    const cards = featuredFishGrid.querySelectorAll('.fish-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Initialize hero section animations
function initHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const ctaButton = document.querySelector('.cta-button');
    
    // Add entrance animations
    if (heroTitle) {
        heroTitle.style.animation = 'fadeInUp 1s ease-out';
    }
    
    if (heroSubtitle) {
        heroSubtitle.style.animation = 'fadeInUp 1s ease-out 0.3s both';
    }
    
    if (ctaButton) {
        ctaButton.style.animation = 'fadeInUp 1s ease-out 0.6s both';
    }
}

// Initialize floating bubbles animation
function initFloatingBubbles() {
    const floatingElements = document.querySelector('.floating-elements');
    if (!floatingElements) return;
    
    // Add more dynamic bubbles
    for (let i = 6; i <= 10; i++) {
        const bubble = document.createElement('div');
        bubble.className = `bubble bubble-${i}`;
        bubble.style.cssText = `
            width: ${Math.random() * 40 + 20}px;
            height: ${Math.random() * 40 + 20}px;
            top: ${Math.random() * 80 + 10}%;
            left: ${Math.random() * 80 + 10}%;
            animation-delay: ${Math.random() * 5}s;
        `;
        floatingElements.appendChild(bubble);
    }
}

// Parallax effect for hero section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (!hero || !heroContent) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Initialize video background
function initVideoBackground() {
    const video = document.querySelector('.video-background video');
    if (!video) return;
    
    // Ensure video plays automatically on mobile devices
    video.addEventListener('loadeddata', () => {
        video.play().catch(e => {
            console.log('Video autoplay prevented:', e);
            // If autoplay is blocked, show a play button or fallback image
        });
    });
    
    // Handle video loading errors
    video.addEventListener('error', () => {
        console.log('Video failed to load, showing fallback');
        const videoContainer = document.querySelector('.video-background');
        if (videoContainer) {
            videoContainer.style.backgroundImage = 'url("https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg")';
            videoContainer.style.backgroundSize = 'cover';
            videoContainer.style.backgroundPosition = 'center';
        }
    });
}

// Initialize intersection observer for features section
function initFeaturesAnimation() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }, {
        threshold: 0.2
    });
    
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Initialize home page
function initHomePage() {
    initFeaturedFish();
    initHeroAnimations();
    initFloatingBubbles();
    initParallaxEffect();
    initVideoBackground();
    initFeaturesAnimation();
    
    // Add smooth scroll behavior to CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton && ctaButton.getAttribute('href') === 'shop.html') {
        ctaButton.addEventListener('click', (e) => {
            // Add a subtle animation before navigation
            ctaButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                ctaButton.style.transform = 'scale(1)';
            }, 150);
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomePage);
} else {
    initHomePage();
}

// Handle page visibility change to pause/resume video
document.addEventListener('visibilitychange', () => {
    const video = document.querySelector('.video-background video');
    if (video) {
        if (document.hidden) {
            video.pause();
        } else {
            video.play().catch(e => console.log('Video play failed:', e));
        }
    }
});

// Preload critical images
function preloadImages() {
    const criticalImages = [
        'https://images.pexels.com/photos/1683545/pexels-photo-1683545.jpeg',
        'https://images.pexels.com/photos/4033148/pexels-photo-4033148.jpeg',
        'https://images.pexels.com/photos/5564115/pexels-photo-5564115.jpeg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize image preloading
preloadImages();