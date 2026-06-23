// script.js — Legacy form & UI logic (with defensive null checks)

const navbar = document.getElementById("navbar");
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const form = document.getElementById("lead-form");
const successMessage = document.getElementById("form-success");
const lamp = document.getElementById("lamp");
const lampChain = lamp?.querySelectorAll(".lamp-chain");
const lampBulb = lamp?.querySelector(".lamp-bulb");
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle?.querySelector(".theme-icon");

// Mobile menu toggle
menuBtn?.addEventListener("click", () => {
  mobileMenu?.classList.toggle("hidden");
});

// Navbar scroll border
if (navbar) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      navbar.classList.add("nav-border");
    } else {
      navbar.classList.remove("nav-border");
    }
  });
}

// Close mobile menu on link click
document.querySelectorAll("#mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu?.classList.add("hidden");
  });
});

// Intersection Observer for fade sections
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".fade-section").forEach((section) => {
  observer.observe(section);
});

// Form validation
const validateField = (field, message) => {
  if (!field) return true;
  const error = field.parentElement?.querySelector(".error-text");
  if (!error) return true;
  if (!field.value.trim()) {
    error.textContent = message;
    error.classList.remove("hidden");
    return false;
  }
  error.classList.add("hidden");
  return true;
};

const validatePhone = (field) => {
  if (!field) return true;
  const error = field.parentElement?.querySelector(".error-text");
  if (!error) return true;
  const cleaned = field.value.replace(/\D/g, "");
  if (cleaned.length < 10) {
    error.textContent = "Enter a valid phone number.";
    error.classList.remove("hidden");
    return false;
  }
  error.classList.add("hidden");
  return true;
};

form?.addEventListener("submit", (event) => {
  successMessage?.classList.add("hidden");
  const nameValid = validateField(form.elements.name, "Please enter your name.");
  const businessValid = validateField(form.elements.business, "Please enter your business name.");
  const typeValid = validateField(form.elements.type, "Please select a business type.");
  const phoneValid = validatePhone(form.elements.phone);
  const messageValid = validateField(form.elements.message, "Please tell us about your project.");

  if (!(nameValid && businessValid && typeValid && phoneValid && messageValid)) {
    event.preventDefault();
    return;
  }

  successMessage?.classList.remove("hidden");
});

// Click sound
const playClickSound = () => {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.value = 160;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.09);
};

// Theme
const setThemeIcon = () => {
  if (!themeIcon) return;
  const isDark = document.documentElement.classList.contains("dark");
  themeIcon.textContent = isDark ? "☾" : "☀︎";
};

const toggleTheme = () => {
  if (!lamp || !lampBulb) return;
  playClickSound();
  lamp.classList.remove("swing");
  void lamp.offsetWidth;
  lamp.classList.add("swing");
  lampBulb.classList.remove("flicker");
  void lampBulb.offsetWidth;
  lampBulb.classList.add("flicker");

  setTimeout(() => {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    lampBulb.classList.remove("flicker");
    setThemeIcon();
  }, 420);
};

lampChain?.forEach((chain) => {
  chain.addEventListener("click", toggleTheme);
});

themeToggle?.addEventListener("click", () => {
  playClickSound();
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  setThemeIcon();
});

setThemeIcon();

// Particle canvas (only if element exists)
const canvas = document.getElementById("particle-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let particles = [];

  const resizeCanvas = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2,
    }));
  };

  const drawParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(15, 15, 15, 0.35)";
    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  };

  resizeCanvas();
  drawParticles();
  window.addEventListener("resize", resizeCanvas);
}
