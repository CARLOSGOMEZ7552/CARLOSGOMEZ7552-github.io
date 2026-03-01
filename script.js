// ====================================
// CustomPointMX - Interactive Scripts
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initCounterAnimation();
    initSmoothScroll();
    initParallax();
});

// --- Theme Toggle ---
function initThemeToggle() {
    const toggles = document.querySelectorAll('#themeToggle, #themeToggleMobile');
    const html = document.documentElement;

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('cp-theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('cp-theme', newTheme);

            // Add a subtle animation to the page
            document.body.style.transition = 'background 0.35s ease, color 0.35s ease';
        });
    });
}

// --- Navbar Scroll Effect ---
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

// --- Mobile Menu Toggle ---
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const menu = document.getElementById('navMenu');

    if (!toggle || !menu) return;

    function closeMenu() {
        menu.classList.remove('active');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('active');
        toggle.classList.toggle('active');
        // Prevent background scroll while menu is open
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    menu.querySelectorAll('.navbar__link, .navbar__cta').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside (on the overlay)
    menu.addEventListener('click', (e) => {
        if (e.target === menu) closeMenu();
    });

    // Close menu on scroll
    window.addEventListener('scroll', () => {
        if (menu.classList.contains('active')) closeMenu();
    }, { passive: true });
}

// --- Scroll Reveal Animation ---
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

// --- Counter Animation ---
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-target]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const rawTarget = entry.target.getAttribute('data-target');
                // Security: Validate that data-target is a safe integer
                const target = parseInt(rawTarget, 10);
                if (isNaN(target) || target < 0 || target > 99999) return;
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
}

function animateCounter(element, target) {
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(startValue + (target - startValue) * easeProgress);

        element.textContent = currentValue + (target === 98 ? '%' : '+');

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// --- Smooth Scroll ---
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// --- Parallax Effects ---
function initParallax() {
    const floatCards = document.querySelectorAll('.hero__float-card');
    const heroVisual = document.querySelector('.hero__visual');

    if (!heroVisual) return;

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        floatCards.forEach((card, i) => {
            const speed = (i + 1) * 5;
            card.style.transform = `translateY(${Math.sin(Date.now() / 1000 + i * 2) * 12}px) translate(${x * speed}px, ${y * speed}px)`;
        });
    }, { passive: true });
}

// --- Typing effect for hero (subtle) ---
(function initTypingEffect() {
    const badge = document.querySelector('.hero__badge');
    if (!badge) return;

    badge.style.opacity = '0';
    badge.style.transform = 'translateY(-10px)';

    setTimeout(() => {
        badge.style.transition = 'all 0.6s ease-out';
        badge.style.opacity = '1';
        badge.style.transform = 'translateY(0)';
    }, 300);
})();

// --- Interactive plan cards ---
// Security: Sanitize function to prevent XSS via DOM content
function sanitizeText(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

document.querySelectorAll('.pricing-card__btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const card = this.closest('.pricing-card');
        const planName = sanitizeText(card.querySelector('.pricing-card__name').textContent.trim());

        // Pulse animation on click
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);

        // Open WhatsApp with plan info (sanitized)
        const message = encodeURIComponent(
            `Hola, me interesa el plan "${planName}". ¿Pueden darme más información y una cotización?`
        );
        // Security: noopener,noreferrer prevents reverse tabnapping
        window.open(`https://wa.me/522288576186?text=${message}`, '_blank', 'noopener,noreferrer');
    });
});

// --- Magnetic effect on buttons ---
document.querySelectorAll('.btn-primary, .btn-secondary, .navbar__cta').forEach(btn => {
    btn.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        this.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', function () {
        this.style.transform = '';
    });
});

// --- Active nav link highlight ---
(function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar__link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === `#${id}`) {
                        link.style.color = 'var(--accent-primary)';
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => observer.observe(section));
})();
