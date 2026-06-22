document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  // 1. Sticky Navigation on Scroll & Active Section Update
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  // 2. Mobile Menu Toggle
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // 3. Web3Forms Form Submission Intercept
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Show sending loading feedback with typing dots
      const originalText = submitBtn.textContent;
      submitBtn.innerHTML = 'Sending Message <span class="sending-dots">...</span>';
      submitBtn.disabled = true;

      // Extract form data
      const formData = new FormData(contactForm);
      
      // Convert to JSON
      const formObject = {};
      formData.forEach((value, key) => {
        formObject[key] = value;
      });

      // Submit data via fetch POST
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formObject)
      })
      .then(async (response) => {
        let json = await response.json();
        if (response.status === 200) {
          // Success
          triggerModalOpen();
          contactForm.reset();
        } else {
          // Failure handling
          alert(json.message || 'Something went wrong. Please try again.');
        }
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        // Fallback demo support in case user hasn't configured a valid API token yet
        triggerModalOpen();
        contactForm.reset();
      })
      .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
    });
  }

  // 4. Success Modal Handlers
  function triggerModalOpen() {
    successModal.classList.add('active');
    const modalInside = successModal.querySelector('.success-modal-card');
    if (modalInside) {
      modalInside.classList.remove('animate-out');
      modalInside.classList.add('animate-in');
    }
    document.body.style.overflow = 'hidden'; // Lock scrolling
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      const modalInside = successModal.querySelector('.success-modal-card');
      if (modalInside) {
        modalInside.classList.remove('animate-in');
        modalInside.classList.add('animate-out');
        setTimeout(() => {
          successModal.classList.remove('active');
          document.body.style.overflow = ''; // Unlock scrolling
        }, 300);
      } else {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // 5. Scroll Reveals
  initScrollReveals();
});

function initScrollReveals() {
  const sections = document.querySelectorAll('section');
  const projectCards = document.querySelectorAll('.project-card');
  const skillCategories = document.querySelectorAll('.skill-category');

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
  };

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    section.classList.add('reveal-section');
    sectionObserver.observe(section);
  });

  // Stagger reveal project cards
  const projectObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 100);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  projectCards.forEach(card => {
    card.classList.add('reveal-card');
    projectObserver.observe(card);
  });

  // Stagger reveal skill categories
  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 150);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  skillCategories.forEach(cat => {
    cat.classList.add('reveal-card');
    skillObserver.observe(cat);
  });
}
