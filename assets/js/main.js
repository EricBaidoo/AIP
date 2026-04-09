const menuToggle = document.querySelector('.menu-toggle');
const menuList = document.querySelector('.menu-list');

if (menuToggle && menuList) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuList.classList.toggle('open');
    const expanded = isOpen ? 'true' : 'false';
    menuToggle.setAttribute('aria-expanded', expanded);
  });

  menuList.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuList.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const heroSlider = document.querySelector('[data-hero-slider]');

if (heroSlider) {
  const images = Array.from(heroSlider.querySelectorAll('.hero-slide-img'));
  const texts = Array.from(heroSlider.querySelectorAll('.hero-slide-text'));
  let currentIndex = 0;
  let autoTimer;

  const showSlide = (index) => {
    const bounded = (index + images.length) % images.length;
    currentIndex = bounded;

    images.forEach((img, imgIndex) => {
      img.classList.toggle('is-active', imgIndex === bounded);
    });

    texts.forEach((text, textIndex) => {
      text.classList.toggle('is-active', textIndex === bounded);
    });
  };

  const startAuto = () => {
    autoTimer = setInterval(() => {
      showSlide(currentIndex + 1);
    }, 5000);
  };

  const stopAuto = () => {
    clearInterval(autoTimer);
  };

  heroSlider.addEventListener('mouseenter', stopAuto);
  heroSlider.addEventListener('mouseleave', startAuto);

  showSlide(0);
  startAuto();
}

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealItems.forEach((item) => observer.observe(item));

const contactForm = document.querySelector('#contact-form');
const feedback = document.querySelector('#form-feedback');

if (contactForm && feedback) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());

    if (!payload.name || !payload.organization || !payload.email || !payload.message) {
      feedback.textContent = 'Please complete all fields before submitting.';
      return;
    }

    feedback.textContent = 'Thank you. Your inquiry has been captured and we will contact you shortly.';
    console.log('Inquiry captured:', payload);
    contactForm.reset();
  });
}

// Scroll-to-top button functionality
const scrollToTopBtn = document.getElementById('scrollToTop');

if (scrollToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

// Counter animations for statistics
function animateCounter(element, finalValue, duration = 1500) {
  const startValue = 0;
  const startTime = Date.now();
  const isDecimal = finalValue % 1 !== 0;

  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentValue = startValue + (finalValue - startValue) * progress;
    const displayValue = isDecimal ? currentValue.toFixed(1) : Math.floor(currentValue);
    element.textContent = displayValue;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = finalValue;
    }
  }

  update();
}

// Observe stat cards and animate counters when visible
const statNumbers = document.querySelectorAll('.stat-number');

if (statNumbers.length > 0) {
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const finalValue = parseInt(element.textContent, 10);

          if (!isNaN(finalValue)) {
            animateCounter(element, finalValue, 1500);
          }

          statObserver.unobserve(element);
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  statNumbers.forEach((stat) => statObserver.observe(stat));
}

// Testimonial Carousel Functionality
function initializeCarousel(carouselName) {
  const carousel = document.querySelector(`[data-carousel="${carouselName}"]`);
  
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const slides = carousel.querySelectorAll('.carousel-slide');
  const dots = carousel.querySelectorAll('.carousel-dot');
  let currentIndex = 0;
  let autoTimer;

  const totalSlides = slides.length;

  const goToSlide = (index) => {
    const bounded = (index + totalSlides) % totalSlides;
    currentIndex = bounded;

    const offset = -bounded * 50;
    track.style.transform = `translateX(${offset}%)`;

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === bounded);
    });
  };

  const nextSlide = () => {
    goToSlide(currentIndex + 1);
  };

  const startAutoPlay = () => {
    autoTimer = setInterval(nextSlide, 6000);
  };

  const stopAutoPlay = () => {
    clearInterval(autoTimer);
  };

  const resetAutoPlay = () => {
    stopAutoPlay();
    startAutoPlay();
  };

  // Dot click handlers
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoPlay();
    });
  });

  // Pause on hover, resume on leave
  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', resetAutoPlay);

  // Touch support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
  });

  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    
    if (touchStartX - touchEndX > 50) {
      // Swiped left
      nextSlide();
    } else if (touchEndX - touchStartX > 50) {
      // Swiped right
      goToSlide(currentIndex - 1);
    }
    
    resetAutoPlay();
  });

  // Start auto-play
  startAutoPlay();
}

// Initialize carousel
initializeCarousel('testimonials');
