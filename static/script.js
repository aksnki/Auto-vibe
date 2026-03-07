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

// Mobile Menu Toggle - FIXED VERSION
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    
    if (menuToggle && mobileOverlay) {
        console.log('Mobile menu initialized');
        
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            this.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
                spans[0].style.transform = 'translateY(9px) rotate(45deg)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'translateY(-9px) rotate(-45deg)';
            } else {
                document.body.style.overflow = '';
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        const mobileLinks = mobileOverlay.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
                
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
        
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !mobileOverlay.contains(e.target)) {
                menuToggle.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
                
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                menuToggle.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
                
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    } else {
        console.error('Mobile menu elements not found!');
    }
});

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || !href) return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
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
        if (counter.dataset.count && !counter.classList.contains('animated')) {
            
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
    
    let current = parseInt(counter.innerText.replace(/[^0-9]/g, '')) || 0;
    
    if (current >= target) return;
    
    const increment = Math.ceil(target / 50);
    const stepTime = 2000 / 50;
    
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
            if (e.target.tagName === 'A') return;
            
            this.classList.toggle('active');
            
            const front = this.querySelector('.card-front');
            const back = this.querySelector('.card-back');
            
            if (front && back) {
                front.classList.toggle('hidden');
                back.classList.toggle('hidden');
            }
            
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
            
            if (window.innerWidth <= 768 && this.classList.contains('active')) {
                setTimeout(() => {
                    this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        });
        
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', 'Click to reveal more information');
    });
}

/**
 * FAQ Accordion Functionality - FIXED VERSION
 */
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length === 0) {
        console.log('No FAQ questions found');
        return;
    }
    
    console.log(`Found ${faqQuestions.length} FAQ items`);
    
    faqQuestions.forEach((question, index) => {
        // Remove any existing event listeners by cloning and replacing
        const newQuestion = question.cloneNode(true);
        question.parentNode.replaceChild(newQuestion, question);
        
        newQuestion.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Find the parent faq-card
            const faqCard = this.closest('.faq-card');
            if (!faqCard) return;
            
            // Find the answer within the same faq-card
            const answer = faqCard.querySelector('.faq-answer');
            const arrow = this.querySelector('.faq-arrow');
            
            if (!answer) return;
            
            // Toggle current FAQ
            this.classList.toggle('active');
            answer.classList.toggle('hidden');
            
            // Rotate arrow
            if (arrow) {
                arrow.style.transform = this.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
            }
            
            console.log(`FAQ ${index + 1} toggled:`, this.classList.contains('active'));
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
            
            const heroSection = document.querySelector('.hero-section');
            if (heroSection) {
                heroSection.style.background = 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)';
            }
        });
        
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
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerText;
                submitBtn.innerText = 'Sending...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.innerText = 'Sent!';
                    submitBtn.style.background = '#10b981';
                    
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
    const preloadLinks = document.querySelectorAll('link[rel="preload"]');
    
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
});

window.addEventListener('offline', function() {
    console.log('Connection lost');
});
