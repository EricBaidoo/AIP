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
