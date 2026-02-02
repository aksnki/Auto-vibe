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

function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Get the FAQ item and answer
            const faqItem = this.closest('.faq-item');
            const answer = this.nextElementSibling;
            const icon = this.querySelector('.faq-icon');
            
            // Check if this FAQ is already active
            const isActive = faqItem.classList.contains('active');
            
            // Close all other FAQs
            document.querySelectorAll('.faq-item.active').forEach(activeItem => {
                if (activeItem !== faqItem) {
                    activeItem.classList.remove('active');
                    activeItem.querySelector('.faq-answer').style.maxHeight = '0';
                    activeItem.querySelector('.faq-answer').style.opacity = '0';
                    activeItem.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current FAQ
            if (!isActive) {
                // Open this FAQ
                faqItem.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.opacity = '1';
                icon.style.transform = 'rotate(180deg)';
            } else {
                // Close this FAQ
                faqItem.classList.remove('active');
                answer.style.maxHeight = '0';
                answer.style.opacity = '0';
                icon.style.transform = 'rotate(0deg)';
            }
        });
        
        // Add keyboard support
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Make FAQ questions focusable
        question.setAttribute('tabindex', '0');
    });
}

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
}