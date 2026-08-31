/* ============================================================
   GYM WEBSITE - COMPLETE VANILLA JAVASCRIPT
   ============================================================ */

const CONFIG = {
    whatsappNumber: '919162313092',
    whatsappBase: 'https://wa.me/',
    countdownTarget: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    animationDuration: 800,
    counterDuration: 2000,
    carouselInterval: 5000
};

/* ============================================================
   1. LOADING SCREEN
   ============================================================ */

(function initLoader() {
    document.addEventListener('DOMContentLoaded', function () {
        const loader = document.getElementById('loader');
        if (!loader) return;

        setTimeout(function () {
            loader.classList.add('hidden');
            loader.addEventListener('transitionend', function handler() {
                loader.style.display = 'none';
                loader.removeEventListener('transitionend', handler);
                initHeroCounters();
            });
        }, 1500);
    });
})();

/* ============================================================
   2. MOBILE NAVIGATION TOGGLE
   ============================================================ */

(function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (!navToggle || !navMenu) return;

    function closeMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }

    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (e) {
        if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
})();

/* ============================================================
   3. STICKY NAVBAR
   ============================================================ */

(function initStickyNav() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(function () {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

/* ============================================================
   4. SMOOTH SCROLLING
   ============================================================ */

(function initSmoothScroll() {
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const targetId = link.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const navbarHeight = 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
})();

/* ============================================================
   5. ACTIVE NAVIGATION LINK
   ============================================================ */

(function initActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = [];

    navLinks.forEach(function (link) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
            const section = document.querySelector(href);
            if (section) {
                sections.push({ element: section, link: link });
            }
        }
    });

    if (sections.length === 0) return;

    let ticking = false;

    function updateActiveLink() {
        let currentSection = null;
        const scrollPos = window.scrollY + 150;

        sections.forEach(function (s) {
            if (s.element.offsetTop <= scrollPos) {
                currentSection = s;
            }
        });

        navLinks.forEach(function (link) {
            link.classList.remove('active');
        });

        if (currentSection) {
            currentSection.link.classList.add('active');
        }
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(function () {
                updateActiveLink();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateActiveLink();
})();

/* ============================================================
   6. SCROLL ANIMATIONS (IntersectionObserver)
   ============================================================ */

(function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(function (el) {
        observer.observe(el);
    });
})();

/* ============================================================
   7. COUNTER ANIMATION
   ============================================================ */

function animateCounter(element, target, duration) {
    let start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        element.textContent = current.toLocaleString('en-US');

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString('en-US');
        }
    }

    requestAnimationFrame(update);
}

function initCounters(selector) {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'), 10);
                if (!isNaN(target)) {
                    animateCounter(entry.target, target, CONFIG.counterDuration);
                }
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(function (el) {
        observer.observe(el);
    });
}

/* ============================================================
   8. HERO STAT COUNTER INTERSECTION
   ============================================================ */

function initHeroCounters() {
    initCounters('.hero-stat-number');
    initCounters('.why-us-counter');
}

/* ============================================================
   9. TESTIMONIAL CAROUSEL
   ============================================================ */

(function initTestimonialCarousel() {
    const track = document.querySelector('.testimonial-track');
    const dots = document.querySelectorAll('.testimonial-dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    const items = document.querySelectorAll('.testimonial-card');

    if (!track || items.length === 0) return;

    let currentIndex = 0;
    let autoTimer = null;

    function goToSlide(index) {
        if (index < 0) index = items.length - 1;
        if (index >= items.length) index = 0;
        currentIndex = index;

        track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';

        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function startAutoAdvance() {
        stopAutoAdvance();
        autoTimer = setInterval(nextSlide, CONFIG.carouselInterval);
    }

    function stopAutoAdvance() {
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
    }

    function resetTimer() {
        stopAutoAdvance();
        startAutoAdvance();
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            nextSlide();
            resetTimer();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            prevSlide();
            resetTimer();
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            goToSlide(index);
            resetTimer();
        });
    });

    const wrapper = track.closest('.testimonial-carousel') || track.parentElement;
    if (wrapper) {
        wrapper.addEventListener('mouseenter', stopAutoAdvance);
        wrapper.addEventListener('mouseleave', startAutoAdvance);
    }

    goToSlide(0);
    startAutoAdvance();
})();

/* ============================================================
   10. GALLERY LIGHTBOX
   ============================================================ */

(function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length === 0) return;

    // Create lightbox HTML
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.id = 'lightbox';
    lightbox.innerHTML =
        '<button class="lightbox-close" aria-label="Close">&times;</button>' +
        '<button class="lightbox-nav lightbox-prev" aria-label="Previous">&#10094;</button>' +
        '<button class="lightbox-nav lightbox-next" aria-label="Next">&#10095;</button>' +
        '<img class="lightbox-img" src="" alt="">';
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    let currentIndex = 0;
    const imageSources = [];

    galleryItems.forEach(function (item, index) {
        const img = item.querySelector('img');
        const src = img ? img.getAttribute('src') : '';
        const alt = img ? img.getAttribute('alt') : '';
        item.setAttribute('data-index', index);
        imageSources.push({ src: src, alt: alt });

        item.addEventListener('click', function () {
            currentIndex = index;
            openLightbox();
        });
    });

    function openLightbox() {
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxImage() {
        if (imageSources[currentIndex]) {
            lightboxImg.setAttribute('src', imageSources[currentIndex].src);
            lightboxImg.setAttribute('alt', imageSources[currentIndex].alt);
        }
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % imageSources.length;
        updateLightboxImage();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
        updateLightboxImage();
    }

    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    prevBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        prevImage();
    });

    nextBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        nextImage();
    });

    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    });
})();

/* ============================================================
   11. FAQ ACCORDION
   ============================================================ */

(function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length === 0) return;

    faqQuestions.forEach(function (question) {
        question.addEventListener('click', function () {
            const faqItem = question.closest('.faq-item');
            if (!faqItem) return;

            const answer = faqItem.querySelector('.faq-answer');
            if (!answer) return;

            const isOpen = faqItem.classList.contains('active');

            // Close all other items
            document.querySelectorAll('.faq-item.active').forEach(function (item) {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    const otherAnswer = item.querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = '0';
                    }
                }
            });

            // Toggle current item
            if (isOpen) {
                faqItem.classList.remove('active');
                answer.style.maxHeight = '0';
            } else {
                faqItem.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
})();

/* ============================================================
   12. FORM VALIDATION HELPERS
   ============================================================ */

function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
    var re = /^[6-9]\d{9}$/;
    var cleaned = phone.replace(/[\s\-\+]/g, '');
    if (cleaned.startsWith('91') && cleaned.length === 12) {
        cleaned = cleaned.substring(2);
    }
    if (cleaned.startsWith('0') && cleaned.length === 11) {
        cleaned = cleaned.substring(1);
    }
    return re.test(cleaned);
}

function showFieldError(field) {
    var group = field.closest('.form-group');
    if (group) group.classList.add('error');
}

function clearFieldError(field) {
    var group = field.closest('.form-group');
    if (group) group.classList.remove('error');
}

/* ============================================================
   13. BMI CALCULATOR
   ============================================================ */

(function initBMICalculator() {
    var bmiForm = document.getElementById('bmiForm');
    var bmiResult = document.getElementById('bmiResult');
    if (!bmiForm || !bmiResult) return;

    bmiForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var height = parseFloat(bmiForm.querySelector('[name="height"]') ?
            bmiForm.querySelector('[name="height"]').value : '');
        var weight = parseFloat(bmiForm.querySelector('[name="weight"]') ?
            bmiForm.querySelector('[name="weight"]').value : '');
        var age = parseFloat(bmiForm.querySelector('[name="age"]') ?
            bmiForm.querySelector('[name="age"]').value : '');
        var gender = bmiForm.querySelector('[name="gender"]') ?
            bmiForm.querySelector('[name="gender"]').value : '';

        if (isNaN(height) || height <= 0 || isNaN(weight) || weight <= 0) {
            return;
        }

        var bmi = weight / Math.pow(height / 100, 2);
        var bmiRounded = bmi.toFixed(1);
        var category, message;

        if (bmi < 18.5) {
            category = 'Underweight';
            message = 'You are underweight. Consider a nutritious diet with adequate calories and consult a nutritionist.';
        } else if (bmi < 25) {
            category = 'Normal Weight';
            message = 'Great job! You are at a healthy weight. Keep maintaining your balanced lifestyle.';
        } else if (bmi < 30) {
            category = 'Overweight';
            message = 'You are slightly overweight. Regular exercise and a controlled diet can help you reach your ideal weight.';
        } else {
            category = 'Obese';
            message = 'Your BMI indicates obesity. We recommend consulting a healthcare professional and starting a guided fitness program.';
        }

        bmiResult.innerHTML =
            '<div class="bmi-score">BMI: <strong>' + bmiRounded + '</strong></div>' +
            '<div class="bmi-category">Category: <strong>' + category + '</strong></div>' +
            '<div class="bmi-message">' + message + '</div>';
        bmiResult.classList.add('show');
    });
})();

/* ============================================================
   14. CALORIE CALCULATOR
   ============================================================ */

(function initCalorieCalculator() {
    var calorieForm = document.getElementById('calorieForm');
    var calorieResult = document.getElementById('calorieResult');
    if (!calorieForm || !calorieResult) return;

    calorieForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var age = parseFloat(calorieForm.querySelector('[name="age"]') ?
            calorieForm.querySelector('[name="age"]').value : '');
        var gender = calorieForm.querySelector('[name="gender"]') ?
            calorieForm.querySelector('[name="gender"]').value : '';
        var weight = parseFloat(calorieForm.querySelector('[name="weight"]') ?
            calorieForm.querySelector('[name="weight"]').value : '');
        var height = parseFloat(calorieForm.querySelector('[name="height"]') ?
            calorieForm.querySelector('[name="height"]').value : '');
        var activity = calorieForm.querySelector('[name="activity"]') ?
            calorieForm.querySelector('[name="activity"]').value : '';

        if (isNaN(age) || age <= 0 || isNaN(weight) || weight <= 0 || isNaN(height) || height <= 0) {
            return;
        }

        var bmr;
        if (gender === 'male' || gender === 'Male') {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }

        var factor = parseFloat(activity) || 1.2;
        var calories = Math.round(bmr * factor);

        var message = 'Based on your profile, you need approximately ' + calories.toLocaleString() +
            ' calories per day to maintain your current weight. Adjust based on your fitness goals.';

        calorieResult.innerHTML =
            '<div class="calorie-score"><strong>' + calories.toLocaleString() + '</strong> kcal/day</div>' +
            '<div class="calorie-message">' + message + '</div>';
        calorieResult.classList.add('show');
    });
})();

/* ============================================================
   15. COUNTDOWN TIMER
   ============================================================ */

(function initCountdownTimer() {
    var daysEl = document.getElementById('countdownDays');
    var hoursEl = document.getElementById('countdownHours');
    var minutesEl = document.getElementById('countdownMinutes');
    var secondsEl = document.getElementById('countdownSeconds');
    var countdownSection = document.getElementById('countdown');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    var target = CONFIG.countdownTarget;

    function pad(num) {
        return num < 10 ? '0' + num : String(num);
    }

    function updateCountdown() {
        var now = new Date().getTime();
        var distance = target.getTime() - now;

        if (distance <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';

            if (countdownSection) {
                var msg = document.createElement('p');
                msg.className = 'countdown-message';
                msg.textContent = 'The offer has expired!';
                if (!countdownSection.querySelector('.countdown-message')) {
                    countdownSection.appendChild(msg);
                }
            }
            return;
        }

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.textContent = pad(days);
        hoursEl.textContent = pad(hours);
        minutesEl.textContent = pad(minutes);
        secondsEl.textContent = pad(seconds);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
})();

/* ============================================================
   16. BACK TO TOP BUTTON
   ============================================================ */

(function initBackToTop() {
    var backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    var ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(function () {
                if (window.scrollY > 500) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    backToTop.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
})();

/* ============================================================
   17. WHATSAPP INTEGRATION
   ============================================================ */

function openWhatsApp(message) {
    var url = CONFIG.whatsappBase + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(message);
    window.open(url, '_blank');
}

(function initWhatsAppLinks() {
    document.querySelectorAll('[data-whatsapp]').forEach(function (el) {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            var message = el.getAttribute('data-whatsapp') || 'Hi, I would like to know more about your gym memberships.';
            openWhatsApp(message);
        });
    });
})();

/* ============================================================
   18. LEAD CAPTURE FORM
   ============================================================ */

(function initLeadForm() {
    var leadForm = document.getElementById('leadForm');
    if (!leadForm) return;

    leadForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var nameField = leadForm.querySelector('[name="name"]');
        var phoneField = leadForm.querySelector('[name="phone"]');
        var emailField = leadForm.querySelector('[name="email"]');
        var goalField = leadForm.querySelector('[name="goal"]');
        var planField = leadForm.querySelector('[name="plan"]');
        var messageField = leadForm.querySelector('[name="message"]');

        var isValid = true;

        // Clear previous errors
        [nameField, phoneField, emailField, goalField, planField].forEach(function (f) {
            if (f) clearFieldError(f);
        });

        // Validate name
        if (nameField && !nameField.value.trim()) {
            showFieldError(nameField);
            isValid = false;
        }

        // Validate phone
        if (phoneField) {
            if (!phoneField.value.trim() || !validatePhone(phoneField.value.trim())) {
                showFieldError(phoneField);
                isValid = false;
            }
        }

        // Validate email
        if (emailField) {
            if (!emailField.value.trim() || !validateEmail(emailField.value.trim())) {
                showFieldError(emailField);
                isValid = false;
            }
        }

        // Validate goal
        if (goalField && !goalField.value.trim()) {
            showFieldError(goalField);
            isValid = false;
        }

        // Validate plan
        if (planField && !planField.value.trim()) {
            showFieldError(planField);
            isValid = false;
        }

        if (!isValid) return;

        var name = nameField.value.trim();
        var phone = phoneField.value.trim();
        var email = emailField.value.trim();
        var goal = goalField.value.trim();
        var plan = planField.value.trim();
        var messageText = messageField ? messageField.value.trim() : '';

        var whatsappMessage =
            'Hi, I want to join your gym.\n\n' +
            'Name: ' + name + '\n' +
            'Phone: ' + phone + '\n' +
            'Email: ' + email + '\n' +
            'Goal: ' + goal + '\n' +
            'Plan: ' + plan + '\n' +
            'Message: ' + (messageText || 'N/A') + '\n\n' +
            'Please contact me.';

        openWhatsApp(whatsappMessage);

        // Show success
        var successEl = leadForm.querySelector('.form-success') ||
            document.createElement('div');
        successEl.className = 'form-success';
        successEl.innerHTML = '<p>Thank you! Your message has been sent via WhatsApp. We will contact you shortly.</p>';

        if (!leadForm.querySelector('.form-success')) {
            leadForm.appendChild(successEl);
        }
        successEl.style.display = 'block';

        leadForm.reset();

        setTimeout(function () {
            successEl.style.display = 'none';
        }, 5000);
    });

    // Clear errors on input
    leadForm.querySelectorAll('input, select, textarea').forEach(function (field) {
        field.addEventListener('input', function () {
            clearFieldError(field);
        });
    });
})();

/* ============================================================
   19. KEYBOARD NAVIGATION (Global)
   ============================================================ */

(function initKeyboardNav() {
    document.addEventListener('keydown', function (e) {
        // Escape key handlers are attached inline in their respective modules
        // This serves as a fallback for any remaining cleanup
        if (e.key === 'Escape') {
            var lightbox = document.getElementById('lightbox');
            if (lightbox && lightbox.classList.contains('active')) return;
        }
    });
})();
