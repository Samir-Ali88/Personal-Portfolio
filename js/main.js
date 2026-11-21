/**
 * SOLO — Samir Ali Portfolio
 * Deep night sky starfield, cursor star-trail outside cards, smooth animations,
 * card tilt/spotlight, typing effect, skill filtering, and contact interactions.
 */

document.addEventListener("DOMContentLoaded", () => {
  initStarfieldBackground();
  initTypingEffect();
  initScrollReveal();
  initNavigationAndScrollUI();
  initCardSpotlightAndTilt();
  initSkillFilter();
  initProfileImageFallback();
  initContactInteractions();
});

/* -------------------------------------------------------------------------- */
/* 1. Dark Night Sky Starfield, Shooting Stars & Cursor Star Trail            */
/* -------------------------------------------------------------------------- */
function initStarfieldBackground() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const starColors = ["#ffffff", "#e2e8f0", "#cbd5e1", "#bae6fd", "#ddd6fe"];
  const cursorStarColors = ["#ffffff", "#bae6fd", "#67e8f9", "#ddd6fe", "#f5d0fe"];
  const cardSelector = ".spotlight-card, .glass-nav, #contact .rounded-3xl, .animate-float";

  let stars = [];
  let shootingStars = [];
  let cursorStars = [];
  let lastMouse = { x: null, y: null };

  function createStars() {
    const count = Math.min(Math.floor((width * height) / 6500), 220);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.35 + 0.35,
      baseAlpha: Math.random() * 0.65 + 0.2,
      twinkleSpeed: Math.random() * 0.015 + 0.004,
      twinklePhase: Math.random() * Math.PI * 2,
      driftY: Math.random() * 0.06 + 0.01,
      color: starColors[Math.floor(Math.random() * starColors.length)],
    }));
  }

  function spawnShootingStar() {
    if (prefersReduced || shootingStars.length >= 2) return;
    shootingStars.push({
      x: Math.random() * width * 0.8 + width * 0.1,
      y: Math.random() * height * 0.35,
      len: Math.random() * 70 + 50,
      speed: Math.random() * 6 + 6,
      angle: Math.PI / 4 + (Math.random() * 0.15 - 0.075),
      alpha: 0.85,
    });
  }

  function spawnCursorStars(x, y, count = 2, burst = false) {
    if (prefersReduced) return;
    for (let i = 0; i < count; i++) {
      if (cursorStars.length >= 130) cursorStars.shift();
      const angle = Math.random() * Math.PI * 2;
      const speed = burst ? Math.random() * 1.8 + 0.5 : Math.random() * 0.9 + 0.2;
      cursorStars.push({
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 0.15,
        size: Math.random() * 3.2 + 1.6,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        alpha: 0.95,
        decay: Math.random() * 0.018 + 0.014,
        isSparkle: Math.random() < 0.65,
        color: cursorStarColors[Math.floor(Math.random() * cursorStarColors.length)],
      });
    }
  }

  function drawFourPointStar(x, y, outerR, rotation, color, alpha) {
    const innerR = outerR * 0.35;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / 4;
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fill();
    ctx.restore();
  }

  // Emit stars when moving mouse outside any cards
  window.addEventListener(
    "mousemove",
    (e) => {
      if (prefersReduced) return;
      const insideCard = e.target && e.target.closest && e.target.closest(cardSelector);
      if (insideCard) {
        lastMouse.x = null;
        lastMouse.y = null;
        return;
      }

      if (lastMouse.x === null || Math.hypot(e.clientX - lastMouse.x, e.clientY - lastMouse.y) >= 12) {
        spawnCursorStars(e.clientX, e.clientY, 2, false);
        lastMouse.x = e.clientX;
        lastMouse.y = e.clientY;
      }
    },
    { passive: true }
  );

  // Gentle mini star burst when clicking on the open sky outside cards
  window.addEventListener("click", (e) => {
    if (prefersReduced) return;
    const insideCard = e.target && e.target.closest && e.target.closest(cardSelector);
    if (!insideCard) {
      spawnCursorStars(e.clientX, e.clientY, 7, true);
    }
  });

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createStars();
  });

  createStars();

  if (!prefersReduced) {
    setInterval(() => {
      if (Math.random() < 0.45) spawnShootingStar();
    }, 4200);
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw background twinkling stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      if (!prefersReduced) {
        s.twinklePhase += s.twinkleSpeed;
        s.y -= s.driftY;
        if (s.y < -2) {
          s.y = height + 2;
          s.x = Math.random() * width;
        }
      }

      const alpha = s.baseAlpha + Math.sin(s.twinklePhase) * 0.22;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = Math.max(0.08, Math.min(1, alpha));
      ctx.fill();
    }

    // Draw shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const st = shootingStars[i];
      const endX = st.x - Math.cos(st.angle) * st.len;
      const endY = st.y - Math.sin(st.angle) * st.len;

      const grad = ctx.createLinearGradient(st.x, st.y, endX, endY);
      grad.addColorStop(0, `rgba(226, 232, 240, ${st.alpha})`);
      grad.addColorStop(1, "rgba(226, 232, 240, 0)");

      ctx.beginPath();
      ctx.moveTo(st.x, st.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.4;
      ctx.globalAlpha = 1;
      ctx.stroke();

      st.x += Math.cos(st.angle) * st.speed;
      st.y += Math.sin(st.angle) * st.speed;
      st.alpha -= 0.015;

      if (st.alpha <= 0 || st.x > width + 100 || st.y > height + 100) {
        shootingStars.splice(i, 1);
      }
    }

    // Draw cursor-emitted stars
    for (let i = cursorStars.length - 1; i >= 0; i--) {
      const cs = cursorStars[i];
      cs.x += cs.vx;
      cs.y += cs.vy;
      cs.vx *= 0.985;
      cs.vy *= 0.985;
      cs.rotation += cs.rotationSpeed;
      cs.alpha -= cs.decay;

      if (cs.alpha <= 0) {
        cursorStars.splice(i, 1);
        continue;
      }

      const currentSize = cs.size * (0.4 + cs.alpha * 0.6);
      if (cs.isSparkle) {
        drawFourPointStar(cs.x, cs.y, currentSize, cs.rotation, cs.color, cs.alpha);
      } else {
        ctx.beginPath();
        ctx.arc(cs.x, cs.y, currentSize * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = cs.color;
        ctx.globalAlpha = cs.alpha;
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
    if (!prefersReduced) {
      requestAnimationFrame(draw);
    }
  }

  draw();
}

/* -------------------------------------------------------------------------- */
/* 2. Hero Typing Animation                                                   */
/* -------------------------------------------------------------------------- */
function initTypingEffect() {
  const el = document.getElementById("typed-text");
  if (!el) return;

  const phrases = [
    "CSE Student @ IIUC",
    "Competitive Programmer",
    "Linux & Python Cybersecurity Learner",
    "Systems & Network Builder",
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      el.textContent = current.substring(0, charIndex);
    } else {
      charIndex++;
      el.textContent = current.substring(0, charIndex);
    }

    let speed = isDeleting ? 38 : 70;

    if (!isDeleting && charIndex === current.length) {
      speed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 400;
    }

    setTimeout(tick, speed);
  }

  tick();
}

/* -------------------------------------------------------------------------- */
/* 3. Smooth Scroll Reveal (IntersectionObserver)                             */
/* -------------------------------------------------------------------------- */
function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

/* -------------------------------------------------------------------------- */
/* 4. Navbar, Active Section Tracking, Progress Bar, Mobile Menu & Back-Top   */
/* -------------------------------------------------------------------------- */
function initNavigationAndScrollUI() {
  const progressBar = document.getElementById("scroll-progress");
  const backToTop = document.getElementById("back-to-top");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");

  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const iconOpen = document.getElementById("menu-icon-open");
  const iconClose = document.getElementById("menu-icon-close");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isHidden = mobileMenu.classList.toggle("hidden");
      menuToggle.setAttribute("aria-expanded", String(!isHidden));
      iconOpen.classList.toggle("hidden", !isHidden);
      iconClose.classList.toggle("hidden", isHidden);
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        menuToggle.setAttribute("aria-expanded", "false");
        iconOpen.classList.remove("hidden");
        iconClose.classList.add("hidden");
      });
    });
  }

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (backToTop) {
      if (scrollTop > 400) {
        backToTop.classList.remove("opacity-0", "translate-y-4", "pointer-events-none");
      } else {
        backToTop.classList.add("opacity-0", "translate-y-4", "pointer-events-none");
      }
    }

    let currentId = "";
    sections.forEach((section) => {
      const top = section.offsetTop - 160;
      if (scrollTop >= top) {
        currentId = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 5. Mouse Spotlight Glow & Subtle 3D Tilt on Cards                          */
/* -------------------------------------------------------------------------- */
function initCardSpotlightAndTilt() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cards = document.querySelectorAll(".spotlight-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);

      if (!prefersReduced && card.classList.contains("tilt-card")) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      }
    });

    card.addEventListener("mouseleave", () => {
      if (card.classList.contains("tilt-card")) {
        card.style.transform = "";
      }
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 6. Interactive Skill Category Filter                                       */
/* -------------------------------------------------------------------------- */
function initSkillFilter() {
  const buttons = document.querySelectorAll(".skill-filter");
  const cards = document.querySelectorAll(".skill-card");
  if (!buttons.length || !cards.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hidden", !match);
      });
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 7. Profile Image Fallback                                                  */
/* -------------------------------------------------------------------------- */
function initProfileImageFallback() {
  const img = document.getElementById("profile-img");
  const fallback = document.getElementById("profile-fallback");
  if (!img || !fallback) return;

  const showFallback = () => {
    img.classList.add("hidden");
    fallback.classList.remove("hidden");
  };

  img.addEventListener("error", showFallback);
  if (img.complete && img.naturalWidth === 0) {
    showFallback();
  }
}

/* -------------------------------------------------------------------------- */
/* 8. Copy Email & Interactive Contact Form                                   */
/* -------------------------------------------------------------------------- */
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
          if (copyLabel) copyLabel.textContent = "Copy Email";
        }, 2200);
      } catch {
        showToast(`Email: ${email}`);
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
        showToast("Please fill out all fields before sending.");
        return;
      }

      const subject = encodeURIComponent(`Portfolio Message from ${name}`);
      const body = encodeURIComponent(`Name: ${name}
Email: ${email}

Message:
${message}`);
      window.location.href = `mailto:samirali.tech88@gmail.com?subject=${subject}&body=${body}`;

      showToast("Opening your email client to send the message!");
      form.reset();
    });
  }
}

/* -------------------------------------------------------------------------- */
/* Helper: Toast Notification                                                 */
/* -------------------------------------------------------------------------- */
let toastTimer;
function showToast(text) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = text;
  toast.classList.remove("opacity-0", "translate-y-4", "pointer-events-none");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-4", "pointer-events-none");
  }, 3200);
}