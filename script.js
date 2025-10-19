window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    const loadingText = document.querySelector('.loading-text');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        loadingProgress.style.width = progress + '%';
        loadingText.textContent = Math.floor(progress) + '%';
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    initLocomotiveScroll();
                }, 500);
            }, 500);
        }
    }, 100);
});

let locoScroll;

function initLocomotiveScroll() {
    locoScroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        multiplier: 1,
        class: 'is-reveal',
        smartphone: {
            smooth: true
        },
        tablet: {
            smooth: true
        },
        reloadOnContextChange: true,
        resetNativeScroll: true
    });

    // Force initial update
    locoScroll.update();
    
    locoScroll.on('scroll', ScrollTrigger.update);

    ScrollTrigger.scrollerProxy('[data-scroll-container]', {
        scrollTop(value) {
            return arguments.length
                ? locoScroll.scrollTo(value, 0, 0)
                : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight
            };
        },
        pinType: document.querySelector('[data-scroll-container]').style.transform
            ? 'transform'
            : 'fixed'
    });

    ScrollTrigger.addEventListener('refresh', () => locoScroll.update());
    
    // Multiple refresh attempts to ensure content loads
    setTimeout(() => {
        ScrollTrigger.refresh();
        locoScroll.update();
    }, 100);
    
    setTimeout(() => {
        ScrollTrigger.refresh();
        locoScroll.update();
    }, 500);

    initAnimations();
    setupSmoothNavigation();
}

// Custom Cursor - Simplified (dot only)
const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');

let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
});

// Cursor interactions
document.querySelectorAll('a, button, .service-card, .project-card').forEach(elem => {
    elem.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
    });
    
    elem.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
    });
});

// Magnetic Effect
document.querySelectorAll('.magnetic').forEach(elem => {
    elem.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(this, {
            duration: 0.3,
            x: x * 0.3,
            y: y * 0.3,
            ease: 'power2.out'
        });
    });
    
    elem.addEventListener('mouseleave', function() {
        gsap.to(this, {
            duration: 0.5,
            x: 0,
            y: 0,
            ease: 'elastic.out(1, 0.5)'
        });
    });
});

// Magnetic Soft Effect
document.querySelectorAll('.magnetic-soft').forEach(elem => {
    elem.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(this, {
            duration: 0.4,
            x: x * 0.15,
            y: y * 0.15,
            ease: 'power2.out'
        });
    });
    
    elem.addEventListener('mouseleave', function() {
        gsap.to(this, {
            duration: 0.6,
            x: 0,
            y: 0,
            ease: 'power2.out'
        });
    });
});

// Mobile Menu
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
const mobileMenuClose = document.querySelector('.mobile-menu-close');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

menuToggle.addEventListener('click', () => {
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    animateMobileMenu();
});

mobileMenuClose.addEventListener('click', () => {
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
});

mobileNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        
        // Close mobile menu
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Smooth scroll to section
        setTimeout(() => {
            smoothScrollToSection(targetId);
        }, 300);
    });
});

function animateMobileMenu() {
    gsap.from('.mobile-nav-link', {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out'
    });
}

// Smooth Navigation for All Links
function setupSmoothNavigation() {
    // Handle all nav links and buttons
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            smoothScrollToSection(targetId);
        });
    });
}

function smoothScrollToSection(targetId) {
    const target = document.querySelector(targetId);
    
    if (target && locoScroll) {
        locoScroll.scrollTo(target, {
            offset: -100,
            duration: 1200,
            easing: [0.25, 0.0, 0.35, 1.0]
        });
    }
}

class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += char;
            } else {
                output += from;
            }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

const scrambleElements = document.querySelectorAll('.scramble-text');
scrambleElements.forEach(el => {
    const fx = new TextScramble(el);
    const text = el.textContent;
    
    setTimeout(() => {
        fx.setText(text);
    }, 1000);
});

// Counter Animation
function animateCounter(elem) {
    const target = parseInt(elem.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            elem.textContent = target + '+';
            clearInterval(timer);
        } else {
            elem.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// Split Text Animation
function splitText() {
    document.querySelectorAll('.title-line').forEach(line => {
        const text = line.textContent;
        line.innerHTML = '';
        
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            line.appendChild(span);
            
            gsap.from(span, {
                scrollTrigger: {
                    trigger: line,
                    scroller: '[data-scroll-container]',
                    start: 'top 85%'
                },
                y: 100,
                opacity: 0,
                rotation: 10,
                duration: 0.8,
                delay: i * 0.03,
                ease: 'power3.out'
            });
        });
    });
}

// Hero Word Animation
function animateHeroWords() {
    gsap.from('.hero-title .word', {
        y: 100,
        opacity: 0,
        rotationX: -90,
        stagger: 0.2,
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.5
    });
}

// Initialize Animations
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    animateHeroWords();
    
    gsap.from('.hero-label', {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-description', {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 1,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-cta', {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 1.3,
        ease: 'power3.out'
    });
    
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
    
 
    splitText();
    

    gsap.utils.toArray('.service-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                scroller: '[data-scroll-container]',
                start: 'top 85%',
            },
            y: 100,
            opacity: 0,
            scale: 0.9,
            duration: 1,
            delay: i * 0.15,
            ease: 'power3.out'
        });
    });
    
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                scroller: '[data-scroll-container]',
                start: 'top 85%',
            },
            y: 120,
            opacity: 0,
            scale: 0.95,
            duration: 1.2,
            delay: i * 0.2,
            ease: 'power3.out'
        });
    });
    
    gsap.utils.toArray('.testimonial-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                scroller: '[data-scroll-container]',
                start: 'top 85%',
            },
            y: 80,
            opacity: 0,
            rotation: 5,
            duration: 1,
            delay: i * 0.2,
            ease: 'power3.out'
        });
    });
    
    gsap.from('.contact-title .title-line', {
        scrollTrigger: {
            trigger: '.contact-title',
            scroller: '[data-scroll-container]',
            start: 'top 80%',
        },
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: 'power4.out'
    });
    
    gsap.from('.footer-main', {
        scrollTrigger: {
            trigger: 'footer',
            scroller: '[data-scroll-container]',
            start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    gsap.from('.footer-col', {
        scrollTrigger: {
            trigger: 'footer',
            scroller: '[data-scroll-container]',
            start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out'
    });
}

const nav = document.querySelector('#nav');
if (locoScroll) {
    locoScroll.on('scroll', (args) => {
        if (args.scroll.y > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

document.querySelectorAll('.service-icon').forEach(icon => {
    icon.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(this, {
            duration: 0.3,
            x: x * 0.2,
            y: y * 0.2,
            ease: 'power2.out'
        });
    });
    
    icon.addEventListener('mouseleave', function() {
        gsap.to(this, {
            duration: 0.5,
            x: 0,
            y: 0,
            ease: 'power2.out'
        });
    });
});

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (locoScroll) {
            locoScroll.update();
        }
        ScrollTrigger.refresh();
    }, 250);
});

if (locoScroll) {
    locoScroll.on('scroll', () => {
        if (locoScroll.scroll.instance.scroll.y > 0) {
            locoScroll.update();
        }
    });
}

setInterval(() => {
    if (locoScroll) {
        locoScroll.update();
    }
}, 2000);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

document.body.style.overflow = 'hidden';
window.addEventListener('load', () => {
    setTimeout(() => {
        document.body.style.overflow = '';
    }, 2000);
});

console.log('✨ Nexus Premium - Loaded successfully!');
console.log('🚀 Locomotive Scroll initialized');
console.log('💫 GSAP animations ready');
console.log('🎯 Smooth navigation enabled');