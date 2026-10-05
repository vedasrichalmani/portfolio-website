const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const themeText = document.querySelector('.theme-text');
const themeIcon = document.querySelector('.theme-icon');
const navLinks = document.querySelectorAll('.nav-link');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

// Read the saved preference and fall back to the required dark default.
const getStoredTheme = () => {
  const savedTheme = localStorage.getItem('portfolio-theme');
  return savedTheme === 'light' ? 'light' : 'dark';
};

// Apply the selected theme and keep the user's preference across refreshes.
const setTheme = (theme) => {
  const isLight = theme === 'light';
  body.classList.toggle('light-theme', isLight);
  localStorage.setItem('portfolio-theme', theme);
  themeToggle.setAttribute('aria-pressed', String(isLight));

  themeText.textContent = isLight ? 'Light Mode' : 'Dark Mode';
  themeIcon.textContent = isLight ? '☀️' : '🌙';
};

const applyInitialTheme = () => {
  const storedTheme = getStoredTheme();
  setTheme(storedTheme);
};

themeToggle.addEventListener('click', () => {
  const isLightTheme = body.classList.contains('light-theme');
  setTheme(isLightTheme ? 'dark' : 'light');
});

// Highlight the navigation link for the section currently in view.
const updateActiveNav = () => {
  const sections = document.querySelectorAll('main section[id]');

  sections.forEach((section) => {
    const top = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;
    const currentScroll = window.scrollY;
    const link = document.querySelector(`.nav-link[href="#${section.id}"]`);

    if (currentScroll >= top && currentScroll < bottom) {
      navLinks.forEach((navLink) => navLink.classList.remove('active'));
      if (link) {
        link.classList.add('active');
      }
    }
  });
};

window.addEventListener('scroll', updateActiveNav);

// Filter placeholder project cards by their data-category attribute.
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filterValue = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.toggle('active', item === button));

    projectCards.forEach((card) => {
      const matchesFilter = filterValue === 'all' || card.dataset.category === filterValue;
      card.classList.toggle('hidden', !matchesFilter);
    });
  });
});

// Validate contact fields locally; this static form does not send messages.
const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

const setFieldError = (fieldName, message) => {
  const errorElement = document.querySelector(`[data-error-for="${fieldName}"]`);
  const inputElement = document.getElementById(fieldName);

  if (errorElement) {
    errorElement.textContent = message;
  }

  if (inputElement) {
    inputElement.classList.toggle('is-invalid', Boolean(message));
  }
};

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const subject = String(formData.get('subject') || '').trim();
  const message = String(formData.get('message') || '').trim();

  let isValid = true;

  const validationRules = [
    {
      field: 'name',
      value: name,
      message: 'Name is required.',
      check: (value) => value.length > 0,
    },
    {
      field: 'email',
      value: email,
      message: 'Please enter a valid email address.',
      check: (value) => validateEmail(value),
    },
    {
      field: 'subject',
      value: subject,
      message: 'Subject is required.',
      check: (value) => value.length > 0,
    },
    {
      field: 'message',
      value: message,
      message: 'Message is required.',
      check: (value) => value.length > 0,
    },
  ];

  validationRules.forEach(({ field, value, message, check }) => {
    if (!check(value)) {
      setFieldError(field, message);
      isValid = false;
    } else {
      setFieldError(field, '');
    }
  });

  if (!isValid) {
    formSuccess.textContent = '';
    return;
  }

  formSuccess.textContent = 'Thank you! Your message has been submitted successfully.';
  contactForm.reset();
  validationRules.forEach(({ field }) => setFieldError(field, ''));
});

applyInitialTheme();
updateActiveNav();
