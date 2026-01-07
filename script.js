// DOM Elements
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");
const navbar = document.querySelector(".navbar");
const contactForm = document.getElementById("contactForm");
const typingText = document.getElementById("typing-text");

// Text for typing animation
const typingStrings = [
  "projects --tech=spring-boot",
  "skills --category=backend",
  "connect --platform=linkedin",
  "email --to=dhiraj",
];

// Slider Variables
let currentSkillsSlide = 0;
let currentProjectsSlide = 0;
const skillsSlidesPerView = 4;
const projectsSlidesPerView = 2;

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  mobileMenuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    mobileMenuBtn.innerHTML = navLinks.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        // Animate skill bars
        if (entry.target.classList.contains("skill-slide")) {
          const levelBar = entry.target.querySelector(".skill-level-bar");
          if (levelBar) {
            const level = levelBar.getAttribute("data-level");
            setTimeout(() => {
              levelBar.style.width = `${level}%`;
            }, 300);
          }
        }

        // Animate counter numbers
        if (entry.target.classList.contains("stat-item")) {
          const numberElement = entry.target.querySelector(".stat-number");
          if (numberElement) {
            const target = parseInt(numberElement.getAttribute("data-count"));
            const suffix = numberElement.textContent.includes("%") ? "%" : "";
            animateCounter(numberElement, target, suffix);
          }
        }
      }
    });
  }, observerOptions);

  // Observe all fade-in elements
  document.querySelectorAll(".fade-in").forEach((el) => {
    observer.observe(el);
  });

  // Contact form submission
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    // In a real application, you would send this data to a server
    // For demo purposes, we'll just show an alert
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      alert(
        `Thank you ${name}! Your message has been sent. I'll get back to you at ${email} soon.`
      );
      contactForm.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });

  // Typing animation
  startTypingAnimation();

  // Floating shapes animation
  animateShapes();

  // Initialize skill bars on page load for those already in view
  document.querySelectorAll(".skill-level-bar").forEach((bar) => {
    const rect = bar.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      const level = bar.getAttribute("data-level");
      bar.style.width = `${level}%`;
    }
  });

  // Initialize sliders
  initSkillsSlider();
  initProjectsSlider();

  // Add ripple effect to buttons
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn") || e.target.closest(".btn")) {
      const btn = e.target.classList.contains("btn")
        ? e.target
        : e.target.closest(".btn");
      btn.classList.add("clicked");
      setTimeout(() => btn.classList.remove("clicked"), 600);
    }
  });
});

// Skills Slider Functions
function initSkillsSlider() {
  const skillsSlider = document.getElementById("skillsSlider");
  const skillsPrevBtn = document.getElementById("skillsPrevBtn");
  const skillsNextBtn = document.getElementById("skillsNextBtn");
  const skillsDots = document.getElementById("skillsDots");

  const skillsSlides = document.querySelectorAll(".skill-slide");
  const totalSkillsSlides = skillsSlides.length;
  const maxSkillsSlide = Math.max(0, totalSkillsSlides - skillsSlidesPerView);

  // Create dots for skills slider
  for (let i = 0; i <= maxSkillsSlide; i++) {
    const dot = document.createElement("div");
    dot.classList.add("slider-dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      goToSkillsSlide(i);
    });
    skillsDots.appendChild(dot);
  }

  // Update slider buttons state
  function updateSkillsButtons() {
    skillsPrevBtn.disabled = currentSkillsSlide === 0;
    skillsNextBtn.disabled = currentSkillsSlide >= maxSkillsSlide;

    // Update dots
    document
      .querySelectorAll("#skillsDots .slider-dot")
      .forEach((dot, index) => {
        if (index === currentSkillsSlide) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
  }

  // Go to specific slide
  function goToSkillsSlide(slideIndex) {
    currentSkillsSlide = Math.max(0, Math.min(slideIndex, maxSkillsSlide));

    const slideWidth = skillsSlides[0].offsetWidth + 20; // Include gap
    skillsSlider.style.transform = `translateX(-${
      currentSkillsSlide * slideWidth
    }px)`;

    updateSkillsButtons();
  }

  // Next slide
  function nextSkillsSlide() {
    if (currentSkillsSlide < maxSkillsSlide) {
      goToSkillsSlide(currentSkillsSlide + 1);
    }
  }

  // Previous slide
  function prevSkillsSlide() {
    if (currentSkillsSlide > 0) {
      goToSkillsSlide(currentSkillsSlide - 1);
    }
  }

  // Event listeners
  skillsPrevBtn.addEventListener("click", prevSkillsSlide);
  skillsNextBtn.addEventListener("click", nextSkillsSlide);

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if (e.key === "ArrowLeft") prevSkillsSlide();
    if (e.key === "ArrowRight") nextSkillsSlide();
  });

  // Auto slide for skills (optional)
  let skillsAutoSlideInterval;

  function startSkillsAutoSlide() {
    skillsAutoSlideInterval = setInterval(() => {
      if (currentSkillsSlide >= maxSkillsSlide) {
        goToSkillsSlide(0);
      } else {
        nextSkillsSlide();
      }
    }, 5000);
  }

  function stopSkillsAutoSlide() {
    clearInterval(skillsAutoSlideInterval);
  }

  // Start auto slide
  startSkillsAutoSlide();

  // Pause auto slide on hover
  skillsSlider.addEventListener("mouseenter", stopSkillsAutoSlide);
  skillsSlider.addEventListener("mouseleave", startSkillsAutoSlide);

  // Initialize
  updateSkillsButtons();

  // Handle window resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Recalculate slide position after resize
      goToSkillsSlide(currentSkillsSlide);
    }, 250);
  });
}

// Projects Slider Functions
function initProjectsSlider() {
  const projectsSlider = document.getElementById("projectsSlider");
  const projectsPrevBtn = document.getElementById("projectsPrevBtn");
  const projectsNextBtn = document.getElementById("projectsNextBtn");
  const projectsDots = document.getElementById("projectsDots");

  const projectsSlides = document.querySelectorAll(".project-slide");
  const totalProjectsSlides = projectsSlides.length;
  let slidesPerView = window.innerWidth < 992 ? 1 : projectsSlidesPerView;
  let maxProjectsSlide = Math.max(0, totalProjectsSlides - slidesPerView);

  // Create dots for projects slider
  for (let i = 0; i <= maxProjectsSlide; i++) {
    const dot = document.createElement("div");
    dot.classList.add("slider-dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      goToProjectsSlide(i);
    });
    projectsDots.appendChild(dot);
  }

  // Update slider based on window size
  function updateProjectsSlidesPerView() {
    slidesPerView = window.innerWidth < 992 ? 1 : projectsSlidesPerView;
    maxProjectsSlide = Math.max(0, totalProjectsSlides - slidesPerView);

    // Recreate dots if needed
    const currentDotCount = projectsDots.children.length;
    if (currentDotCount !== maxProjectsSlide + 1) {
      projectsDots.innerHTML = "";
      for (let i = 0; i <= maxProjectsSlide; i++) {
        const dot = document.createElement("div");
        dot.classList.add("slider-dot");
        if (i === currentProjectsSlide) dot.classList.add("active");
        dot.addEventListener("click", () => {
          goToProjectsSlide(i);
        });
        projectsDots.appendChild(dot);
      }
    }

    // Adjust current slide if it's out of bounds
    if (currentProjectsSlide > maxProjectsSlide) {
      currentProjectsSlide = maxProjectsSlide;
    }

    updateProjectsButtons();
    goToProjectsSlide(currentProjectsSlide);
  }

  // Update slider buttons state
  function updateProjectsButtons() {
    projectsPrevBtn.disabled = currentProjectsSlide === 0;
    projectsNextBtn.disabled = currentProjectsSlide >= maxProjectsSlide;

    // Update dots
    document
      .querySelectorAll("#projectsDots .slider-dot")
      .forEach((dot, index) => {
        if (index === currentProjectsSlide) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
  }

  // Go to specific slide
  function goToProjectsSlide(slideIndex) {
    currentProjectsSlide = Math.max(0, Math.min(slideIndex, maxProjectsSlide));

    const slideWidth = projectsSlides[0].offsetWidth + 40; // Include gap
    projectsSlider.style.transform = `translateX(-${
      currentProjectsSlide * slideWidth
    }px)`;

    updateProjectsButtons();
  }

  // Next slide
  function nextProjectsSlide() {
    if (currentProjectsSlide < maxProjectsSlide) {
      goToProjectsSlide(currentProjectsSlide + 1);
    }
  }

  // Previous slide
  function prevProjectsSlide() {
    if (currentProjectsSlide > 0) {
      goToProjectsSlide(currentProjectsSlide - 1);
    }
  }

  // Event listeners
  projectsPrevBtn.addEventListener("click", prevProjectsSlide);
  projectsNextBtn.addEventListener("click", nextProjectsSlide);

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if (e.key === "ArrowLeft") prevProjectsSlide();
    if (e.key === "ArrowRight") nextProjectsSlide();
  });

  // Auto slide for projects (optional)
  let projectsAutoSlideInterval;

  function startProjectsAutoSlide() {
    projectsAutoSlideInterval = setInterval(() => {
      if (currentProjectsSlide >= maxProjectsSlide) {
        goToProjectsSlide(0);
      } else {
        nextProjectsSlide();
      }
    }, 6000);
  }

  function stopProjectsAutoSlide() {
    clearInterval(projectsAutoSlideInterval);
  }

  // Start auto slide
  startProjectsAutoSlide();

  // Pause auto slide on hover
  projectsSlider.addEventListener("mouseenter", stopProjectsAutoSlide);
  projectsSlider.addEventListener("mouseleave", startProjectsAutoSlide);

  // Initialize
  updateProjectsSlidesPerView();
  updateProjectsButtons();

  // Handle window resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateProjectsSlidesPerView();
    }, 250);
  });
}

// Counter animation function
function animateCounter(element, target, suffix = "") {
  let current = 0;
  const increment = target / 100;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent =
      suffix === "%"
        ? `${current.toFixed(1)}${suffix}`
        : `${Math.floor(current)}${suffix}`;
  }, 20);
}

// Typing animation
function startTypingAnimation() {
  let stringIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentString = typingStrings[stringIndex];

    if (isDeleting) {
      // Deleting chars
      typingText.textContent = currentString.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Adding chars
      typingText.textContent = currentString.substring(0, charIndex + 1);
      charIndex++;
    }

    // Determine typing speed
    let typeSpeed = 100;

    if (isDeleting) {
      typeSpeed /= 2;
    }

    // If word is complete
    if (!isDeleting && charIndex === currentString.length) {
      typeSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      stringIndex++;
      if (stringIndex >= typingStrings.length) stringIndex = 0;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  // Start the animation after a delay
  setTimeout(type, 1000);
}

// Animate floating shapes
function animateShapes() {
  const shapes = document.querySelectorAll(".shape");
  shapes.forEach((shape, index) => {
    // Randomize animation delay and duration
    const delay = index * 0.5;
    const duration = 6 + Math.random() * 4;

    shape.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;

    // Randomize size and position slightly
    const size = shape.getBoundingClientRect().width;
    shape.style.width = `${size * (0.8 + Math.random() * 0.4)}px`;
    shape.style.height = shape.style.width;
  });
}
