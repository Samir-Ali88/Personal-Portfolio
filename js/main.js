/**
 * SOLO — Samir Ali Portfolio
 * Smooth scroll reveal, typing effect, active nav tracking,
 * skill category filtering, and contact form interactions.
 */

document.addEventListener("DOMContentLoaded", () => {
  initTypingEffect();
  initScrollReveal();
  initNavigationAndProgress();
  initSkillFilter();
  initProfileFallback();
  initContactInteractions();
});

function initTypingEffect() {
  const el = document.getElementById("typed-text");
  if (!el) return;

  const phrases = [
    "Competitive Programmer",
    "Web & Firebase Developer",
    "Linux & Python Cybersecurity Learner",
    "Systems & Network Builder",
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function tick() {
    const current = phrases[phraseIdx];
    charIdx = deleting ? charIdx - 1 : charIdx + 1;
    el.textContent = current.substring(0, charIdx);

    let delay = deleting ? 36 : 68;
    if (!deleting && charIdx === current.length) {
      delay = 1700;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 350;
    }
    setTimeout(tick, delay);
  }
  tick();
}

function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

function initNavigationAndProgress() {
  const progress = document.getElementById("scroll-progress");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");

  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const iconOpen = document.getElementById("menu-icon-open");
  const iconClose = document.getElementById("menu-icon-close");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const hidden = mobileMenu.classList.toggle("hidden");
      menuToggle.setAttribute("aria-expanded", String(!hidden));
      iconOpen.classList.toggle("hidden", !hidden);
      iconClose.classList.toggle("hidden", hidden);
    });

    document.querySelectorAll(".mobile-link").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        menuToggle.setAttribute("aria-expanded", "false");
        iconOpen.classList.remove("hidden");
        iconClose.classList.add("hidden");
      });
    });
  }

  function onScroll() {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress && h > 0) {
      progress.style.width = `${(y / h) * 100}%`;
    }

    let current = "home";
    sections.forEach((sec) => {
      if (y >= sec.offsetTop - 180) current = sec.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function initSkillFilter() {
  const buttons = document.querySelectorAll(".skill-filter");
  const cards = document.querySelectorAll(".skill-card");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      cards.forEach((card) => {
        const show = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hidden", !show);
      });
    });
  });
}

function initProfileFallback() {
  const img = document.getElementById("profile-img");
  const fallback = document.getElementById("profile-fallback");
  if (!img || !fallback) return;

  const showFallback = () => {
    img.classList.add("hidden");
    fallback.classList.remove("hidden");
  };

  img.addEventListener("error", showFallback);
  if (img.complete && img.naturalWidth === 0) showFallback();
}

function initContactInteractions() {
  const copyBtn = document.getElementById("copy-email-btn");
  const copyLabel = document.getElementById("copy-email-label");
  const form = document.getElementById("contact-form");

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        if (copyLabel) copyLabel.textContent = "Copied!";
        showToast("Email copied to clipboard!");
        setTimeout(() => {
          if (copyLabel) copyLabel.textContent = "Copy Email Address";
        }, 2000);
      } catch {
        showToast(email);
      }
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        showToast("Please fill in all fields first.");
        return;
      }

      const subject = encodeURIComponent(`Portfolio Message from ${name}`);
      const body = encodeURIComponent(`Name: ${name}
Email: ${email}

Message:
${message}`);
      window.location.href = `mailto:samirali.tech88@gmail.com?subject=${subject}&body=${body}`;
      showToast("Opening your email client!");
      form.reset();
    });
  }
}

let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove("opacity-0", "translate-y-4", "pointer-events-none");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-4", "pointer-events-none");
  }, 3000);
}
