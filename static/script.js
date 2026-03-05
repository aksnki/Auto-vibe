// script.js

// Smooth scrolling
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initSmoothScroll();
    initScrollAnimations();
    initCounterAnimation();
    initWhyCards();
    initFAQ();
    initVideoFallback();
    initSlideAnimations();
});

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .fade-in, .package-card, .portfolio-item, .faq-item').forEach(el => {
        observer.observe(el);
    });
}

function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower
    
    counters.forEach(counter => {
        const animate = () => {
            const value = +counter.getAttribute('data-count');
            const data = +counter.innerText;
            
            const time = value / speed;
            if (data < value) {
                counter.innerText = Math.ceil(data + time);
                setTimeout(animate, 20);
            } else {
                counter.innerText = value;
            }
        };
        
        // Only animate when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animate();
                observer.unobserve(counter);
            }
        });
        
        observer.observe(counter);
    });
}

function initWhyCards() {
    const whyCards = document.querySelectorAll('.why-card');
    
    whyCards.forEach(card => {
        card.addEventListener('click', function() {
            // Close other open cards
            whyCards.forEach(otherCard => {
                if (otherCard !== card && otherCard.classList.contains('active')) {
                    otherCard.classList.remove('active');
                    otherCard.querySelector('.reveal-content').classList.add('hidden');
                }
            });
            
            // Toggle current card
            this.classList.toggle('active');
            const revealContent = this.querySelector('.reveal-content');
            revealContent.classList.toggle('hidden');
            
            // Scroll to show full content if needed
            if (this.classList.contains('active')) {
                const cardRect = this.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                if (cardRect.bottom > viewportHeight - 50) {
                    this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
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
    });
}

// FAQ Accordion - Works with all designs
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('.faq-icon');
            
            // Toggle current FAQ
            answer.classList.toggle('hidden');
            icon.classList.toggle('rotate');
            
            // Optional: Close others (uncomment if you want only one open at a time)
            
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    otherQuestion.nextElementSibling.classList.add('hidden');
                    otherQuestion.querySelector('.faq-icon').classList.remove('rotate');
                }
            });
            
        });
    });
});

function initVideoFallback() {
    const video = document.querySelector('video');
    if (video) {
        video.addEventListener('error', function() {
            console.log('Video failed to load, using fallback image');
        });
    }
}

function initSlideAnimations() {
    // Add animation classes to elements
    const slideLeftElements = document.querySelectorAll('.slide-in-left');
    const slideRightElements = document.querySelectorAll('.slide-in-right');
    
    slideLeftElements.forEach(el => {
        el.classList.add('slide-in-left');
    });
    
    slideRightElements.forEach(el => {
        el.classList.add('slide-in-right');
    });


// Add to your script.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.hidden.md\\:flex');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
});
}    
    
