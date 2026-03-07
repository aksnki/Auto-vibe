
// script.js - AUTO VIBE Complete Functionality

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initCounterAnimation();
    initWhyCards();
    initFAQ();
    initVideoFallback();
    initActiveNavHighlight();
    initFormHandling();
});

/**
 * Mobile Menu Toggle - CRITICAL FIX
 * Only shows on mobile, only logo visible initially
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    
    if (!menuToggle || !mobileOverlay) return;
    
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Toggle active classes
        this.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (mobileOverlay.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking on a link
    const mobileLinks = mobileOverlay.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!menuToggle.contains(e.target) && !mobileOverlay.contains(e.target)) {
            menuToggle.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu on window resize (if going to desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            menuToggle.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (href === '#' || !href) return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                // Account for fixed header
                const headerOffset = window.innerWidth > 768 ? 90 : 70;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll Animations - Fade in elements when they come into view
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.service-card, .package-card, .portfolio-item, .why-card, .faq-card, .stat-card'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // If it's a counter, start animation
                if (entry.target.classList.contains('stat-card')) {
                    const counter = entry.target.querySelector('.counter, .stat-number');
                    if (counter && counter.dataset.count) {
                        animateCounter(counter);
                    }
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Counter Animation for Statistics
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter, .stat-number[data-count]');
    
    counters.forEach(counter => {
        // Only animate if not already animated and has data-count
        if (counter.dataset.count && !counter.classList.contains('animated')) {
            
            // Check if element is in viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(counter);
                        observer.unobserve(counter);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        }
    });
}

/**
 * Animate individual counter
 */
function animateCounter(counter) {
    const target = parseInt(counter.dataset.count);
    if (isNaN(target)) return;
    
    counter.classList.add('animated');
    
    // Get current value (remove any non-numeric characters)
    let current = parseInt(counter.innerText.replace(/[^0-9]/g, '')) || 0;
    
    // Don't animate if already at or above target
    if (current >= target) return;
    
    const increment = Math.ceil(target / 50); // Smooth animation over ~50 steps
    const duration = 2000; // 2 seconds
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            counter.innerText = target + '+';
            clearInterval(timer);
        } else {
            counter.innerText = current + '+';
        }
    }, stepTime);
}

/**
 * Why Cards Interactive Functionality
 */
function initWhyCards() {
    const whyCards = document.querySelectorAll('.why-card');
    
    whyCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't toggle if clicking on a link
            if (e.target.tagName === 'A') return;
            
            // Toggle active class
            this.classList.toggle('active');
            
            // Find front and back elements
            const front = this.querySelector('.card-front');
            const back = this.querySelector('.card-back');
            
            if (front && back) {
                front.classList.toggle('hidden');
                back.classList.toggle('hidden');
            }
            
            // Close other cards (optional - comment out if you want multiple open)
            whyCards.forEach(otherCard => {
                if (otherCard !== card && otherCard.classList.contains('active')) {
                    otherCard.classList.remove('active');
                    
                    const otherFront = otherCard.querySelector('.card-front');
                    const otherBack = otherCard.querySelector('.card-back');
                    
                    if (otherFront && otherBack) {
                        otherFront.classList.remove('hidden');
                        otherBack.classList.add('hidden');
                    }
                }
            });
            
            // Scroll to show full card if needed (on mobile)
            if (window.innerWidth <= 768 && this.classList.contains('active')) {
                setTimeout(() => {
                    this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        });
        
        // Add keyboard support
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Make cards focusable
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', 'Click to reveal more information');
    });
}

/**
 * FAQ Accordion Functionality
 */
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const arrow = this.querySelector('.faq-arrow');
            
            // Toggle current FAQ
            this.classList.toggle('active');
            
            if (answer) {
                answer.classList.toggle('hidden');
            }
            
            if (arrow) {
                arrow.style.transform = this.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
            }
            
            // Optional: Close other FAQs
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this && otherQuestion.classList.contains('active')) {
                    otherQuestion.classList.remove('active');
                    
                    const otherAnswer = otherQuestion.nextElementSibling;
                    const otherArrow = otherQuestion.querySelector('.faq-arrow');
                    
                    if (otherAnswer) {
                        otherAnswer.classList.add('hidden');
                    }
                    
                    if (otherArrow) {
                        otherArrow.style.transform = 'rotate(0)';
                    }
                }
            });
        });
    });
}

/**
 * Video Fallback Handler
 */
function initVideoFallback() {
    const video = document.querySelector('.hero-video');
    
    if (video) {
        video.addEventListener('error', function() {
            console.log('Video failed to load - using fallback');
            
            // Add fallback background color
            const heroSection = document.querySelector('.hero-section');
            if (heroSection) {
                heroSection.style.background = 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)';
            }
        });
        
        // Ensure video plays
        video.play().catch(error => {
            console.log('Video autoplay failed:', error);
        });
    }
}

/**
 * Active Navigation Highlight on Scroll
 */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-menu-content a');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    window.addEventListener('scroll', throttle(() => {
        let current = '';
        const scrollPosition = window.scrollY + (window.innerWidth > 768 ? 100 : 70);
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 100));
}

/**
 * Form Handling (if any forms exist)
 */
function initFormHandling() {
    // Handle any contact forms if they exist
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerText;
                submitBtn.innerText = 'Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual AJAX)
                setTimeout(() => {
                    submitBtn.innerText = 'Sent!';
                    submitBtn.style.background = '#10b981';
                    
                    // Reset after 3 seconds
                    setTimeout(() => {
                        submitBtn.innerText = originalText;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                        this.reset();
                    }, 3000);
                }, 1500);
            }
        });
    });
}

/**
 * Utility: Throttle function to limit scroll event calls
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Handle Window Resize
 */
window.addEventListener('resize', throttle(function() {
    // Adjust any responsive elements
    const mobileMenu = document.querySelector('.mobile-menu-overlay');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (window.innerWidth > 768) {
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
        }
        if (menuToggle && menuToggle.classList.contains('active')) {
            menuToggle.classList.remove('active');
        }
        document.body.style.overflow = '';
    }
}, 200));

/**
 * Lazy Loading Images
 */
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

/**
 * Performance Optimization: Preload critical resources
 */
window.addEventListener('load', function() {
    // Preload next page resources
    const preloadLinks = document.querySelectorAll('link[rel="preload"]');
    
    // Remove any loading spinners if they exist
    const loaders = document.querySelectorAll('.loader');
    loaders.forEach(loader => loader.remove());
});

/**
 * Error Handling for External Scripts
 */
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'SCRIPT') {
        console.log('External script failed to load:', e.target.src);
    }
}, true);

/**
 * Handle Offline/Online Status
 */
window.addEventListener('online', function() {
    console.log('Connection restored');
    // Refresh any dynamic content if needed
});

window.addEventListener('offline', function() {
    console.log('Connection lost');
    // Show offline notification if needed
});
