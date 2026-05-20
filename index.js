document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================================================
     THEME TOGGLE SYSTEM (Light / Dark Mode with LocalStorage)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const sunIcon = themeToggleBtn.querySelector('.sun-icon');
  const moonIcon = themeToggleBtn.querySelector('.moon-icon');
  
  // Retrieve saved preference or check system setting
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  // Set initial theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcons(currentTheme);
  
  // Toggle click event handler
  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
  });
  
  function updateThemeIcons(theme) {
    if (theme === 'dark') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  }

  /* ==========================================================================
     GLASS NAVIGATION COMPACT ON SCROLL
     ========================================================================== */
  const mainHeader = document.getElementById('main-header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  });

  /* ==========================================================================
     ANIMATED STATS COUNT-UP
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-num');
  
  const animateStats = () => {
    statNumbers.forEach(stat => {
      const valStr = stat.getAttribute('data-val');
      const targetVal = parseFloat(valStr);
      const decimalIdx = valStr.indexOf('.');
      const decimals = decimalIdx === -1 ? 0 : valStr.length - decimalIdx - 1;
      const isDecimal = decimals > 0;
      
      let currentVal = 0;
      const duration = 2000; // 2 seconds animation
      const stepTime = 30; // ms per step
      const steps = duration / stepTime;
      const increment = targetVal / steps;
      
      let stepCount = 0;
      
      const timer = setInterval(() => {
        currentVal += increment;
        stepCount++;
        
        if (stepCount >= steps) {
          clearInterval(timer);
          stat.textContent = isDecimal ? targetVal.toFixed(decimals) : Math.round(targetVal);
        } else {
          stat.textContent = isDecimal ? currentVal.toFixed(decimals) : Math.round(currentVal);
        }
      }, stepTime);
    });
  };

  // Run stats animation after hero fade-in completes
  setTimeout(animateStats, 500);

  /* ==========================================================================
     PROJECT TABS GALLERY FILTERING SYSTEM
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Remove active from other buttons and add to current
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const selectedFilter = btn.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (selectedFilter === 'all' || category === selectedFilter) {
          // Reset style first, display, then transition in
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          // Transition out first, then hide display
          card.style.opacity = '0';
          card.style.transform = 'scale(0.92)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 350); // Matches transitions
        }
      });
    });
  });

  /* ==========================================================================
     INTERSECTION OBSERVER FOR SCROLL REVEAL ANIMATIONS
     ========================================================================== */
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Reveal only once
      }
    });
  };
  
  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null, // viewport
    threshold: 0.15, // trigger when 15% is visible
    rootMargin: '0px 0px -50px 0px' // adjust threshold box
  });
  
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  /* ==========================================================================
     CONTACT FORM VALIDATION & DUMMY ACTION
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const successMessage = document.getElementById('form-success');
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const messageInput = document.getElementById('form-message');
    
    let isFormValid = true;
    
    // Name validation
    if (!nameInput.value.trim()) {
      invalidateInput(nameInput);
      isFormValid = false;
    } else {
      validateInput(nameInput);
    }
    
    // Email validation
    if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
      invalidateInput(emailInput);
      isFormValid = false;
    } else {
      validateInput(emailInput);
    }
    
    // Message validation
    if (!messageInput.value.trim()) {
      invalidateInput(messageInput);
      isFormValid = false;
    } else {
      validateInput(messageInput);
    }
    
    if (isFormValid) {
      // Fade out form and fade in success screen
      contactForm.style.transition = 'opacity 0.4s ease';
      contactForm.style.opacity = '0';
      
      setTimeout(() => {
        contactForm.style.display = 'none';
        successMessage.style.display = 'block';
        successMessage.style.opacity = '0';
        setTimeout(() => {
          successMessage.style.opacity = '1';
        }, 50);
      }, 400);
    }
  });
  
  function invalidateInput(input) {
    const parentGroup = input.closest('.form-group');
    parentGroup.classList.add('invalid');
  }
  
  function validateInput(input) {
    const parentGroup = input.closest('.form-group');
    parentGroup.classList.remove('invalid');
  }
  
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
  
  // Real-time error removal on typing
  const inputs = document.querySelectorAll('.form-input');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const parentGroup = input.closest('.form-group');
      if (parentGroup.classList.contains('invalid')) {
        parentGroup.classList.remove('invalid');
      }
    });
  });

  /* ==========================================================================
     CURRENT COPYRIGHT YEAR IN FOOTER
     ========================================================================== */
  const currentYearSpan = document.getElementById('current-year');
  currentYearSpan.textContent = new Date().getFullYear();

});
