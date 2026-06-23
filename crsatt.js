/* ============================================================
   CRS Agro Trade Team — Main JavaScript
   Theme · Scroll · Forms · Animations · Interactions
   ============================================================ */

"use strict";

// ── Theme ─────────────────────────────────────────────────
const ThemeManager = (() => {
  const key = "crsatt-theme";
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");

  const icons = { light: "⭐", dark: "⭐" };

  function get() {
    return (
      localStorage.getItem(key) ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  }

  function set(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(key, theme);
    if (btn) btn.textContent = icons[theme === "dark" ? "light" : "dark"];
    if (btn)
      btn.setAttribute(
        "aria-label",
        `Switch to ${theme === "dark" ? "light" : "dark"} mode`,
      );
  }

  function toggle() {
    set(get() === "dark" ? "light" : "dark");
  }

  function init() {
    set(get());
    if (btn) btn.addEventListener("click", toggle);
  }

  return { init, toggle, get };
})();

// ── Navbar ────────────────────────────────────────────────
const NavManager = (() => {
  const navbar = document.querySelector(".navbar");
  const hamburger = document.querySelector(".navbar__hamburger");
  const mobileNav = document.querySelector(".mobile-nav");
  let menuOpen = false;

  function onScroll() {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 20);
    // Active link highlighting
    document.querySelectorAll("section[id]").forEach((sec) => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 100 && top > -sec.offsetHeight + 100) {
        document.querySelectorAll(".navbar__links a").forEach((a) => {
          a.classList.toggle("active", a.getAttribute("href") === `#${sec.id}`);
        });
      }
    });
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
    if (mobileNav) mobileNav.classList.toggle("open", menuOpen);
    hamburger.classList.toggle("open", menuOpen);
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const spans = hamburger.querySelectorAll("span");
    if (menuOpen) {
      spans[0].style.cssText = "transform:translateY(7px) rotate(45deg)";
      spans[1].style.cssText = "opacity:0";
      spans[2].style.cssText = "transform:translateY(-7px) rotate(-45deg)";
    } else {
      spans.forEach((s) => (s.style.cssText = ""));
    }
  }

  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    if (mobileNav) mobileNav.classList.remove("open");
    hamburger.classList.remove("open");
    document.body.style.overflow = "";
    hamburger.querySelectorAll("span").forEach((s) => (s.style.cssText = ""));
  }

  function init() {
    if (hamburger) hamburger.addEventListener("click", toggleMenu);
    if (mobileNav) {
      mobileNav
        .querySelectorAll("a")
        .forEach((a) => a.addEventListener("click", closeMenu));
    }
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const target = document.querySelector(a.getAttribute("href"));
        if (target) {
          e.preventDefault();
          closeMenu();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  return { init };
})();

// ── Scroll Reveal ─────────────────────────────────────────
const RevealManager = (() => {
  let observer;

  function init() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    items.forEach((el) => observer.observe(el));
  }

  return { init };
})();

// ── Back to Top ───────────────────────────────────────────
const BackTop = (() => {
  const btn = document.getElementById("back-top");

  function init() {
    if (!btn) return;
    window.addEventListener(
      "scroll",
      () => {
        btn.classList.toggle("visible", window.scrollY > 400);
      },
      { passive: true },
    );
    btn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }

  return { init };
})();

// ── Counter Animations ────────────────────────────────────
const CounterManager = (() => {
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    const duration = 2000;
    const start = performance.now();
    const isFloat = String(target).includes(".");

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent =
        prefix +
        (isFloat ? value.toFixed(1) : Math.floor(value).toLocaleString()) +
        suffix;
      if (progress < 1) requestAnimationFrame(step);
      else
        el.textContent =
          prefix +
          (isFloat ? target.toFixed(1) : target.toLocaleString()) +
          suffix;
    }
    requestAnimationFrame(step);
  }

  function init() {
    const counters = document.querySelectorAll("[data-target]");
    if (!counters.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );
    counters.forEach((el) => obs.observe(el));
  }

  return { init };
})();

// ── Toast Notification ────────────────────────────────────
const Toast = (() => {
  let toastEl;

  function show(message, icon = "⭐", duration = 4000) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = `<span class="toast__icon">${icon}</span><span>${message}</span>`;
    toastEl.classList.add("show");
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(
      () => toastEl.classList.remove("show"),
      duration,
    );
  }

  return { show };
})();

// ── Registration Form ─────────────────────────────────────
const FormManager = (() => {
  const form = document.getElementById("reg-form");
  const steps = document.querySelectorAll(".form-step");
  let currentStep = 0;

  function updateSteps(step) {
    steps.forEach((s, i) => {
      s.classList.toggle("active", i === step);
      s.classList.toggle("done", i < step);
    });
  }

  function validateSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return true;
    const required = section.querySelectorAll("[required]");
    let valid = true;
    required.forEach((input) => {
      if (!input.value.trim()) {
        input.style.borderColor = "#e24b4a";
        input.addEventListener("input", () => (input.style.borderColor = ""), {
          once: true,
        });
        valid = false;
      }
    });
    return valid;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateSection("form-section-" + currentStep)) {
      Toast.show("Please fill in all required fields.", "⭐");
      return;
    }
    // Simulate submission
    const submitBtn = form.querySelector(".form-submit");
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<span style="display:inline-block;animation:spin 0.8s linear infinite;border:2px solid #fff;border-top-color:transparent;border-radius:50%;width:16px;height:16px;"></span> Submitting…';
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = "⭐ Application Submitted!";
      submitBtn.style.background = "linear-gradient(135deg,#2e8b2e,#145214)";
      updateSteps(3);
      Toast.show(
        "Registration successful! We will contact you within 48 hours.",
        "⭐",
        6000,
      );
      form
        .querySelectorAll("input,select,textarea")
        .forEach((i) => (i.value = ""));
    }, 2000);
  }

  function init() {
    if (!form) return;
    updateSteps(0);
    form.querySelectorAll(".btn-next").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sectionId = btn.closest(".form-section")?.id;
        if (validateSection(sectionId)) {
          currentStep = Math.min(currentStep + 1, steps.length - 1);
          updateSteps(currentStep);
          document.querySelectorAll(".form-section").forEach((s, i) => {
            s.style.display = i === currentStep ? "block" : "none";
          });
          form.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          Toast.show("Please fill in all required fields to continue.", "⭐");
        }
      });
    });
    form.querySelectorAll(".btn-prev").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentStep = Math.max(currentStep - 1, 0);
        updateSteps(currentStep);
        document.querySelectorAll(".form-section").forEach((s, i) => {
          s.style.display = i === currentStep ? "block" : "none";
        });
      });
    });
    form.addEventListener("submit", handleSubmit);
    // Show only first section initially
    document.querySelectorAll(".form-section").forEach((s, i) => {
      s.style.display = i === 0 ? "block" : "none";
    });
  }

  return { init };
})();

// ── Contact Form ──────────────────────────────────────────
const ContactForm = (() => {
  function init() {
    const form = document.getElementById("contact-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = "Sending…";
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = "Message Sent ⭐";
        Toast.show(
          "Your message has been received. We'll respond within 24 hours.",
          "⭐",
          5000,
        );
        form.reset();
        setTimeout(() => (btn.textContent = "Send Message"), 3000);
      }, 1800);
    });
  }
  return { init };
})();

// ── Service Cards interaction ─────────────────────────────
const ServiceCards = (() => {
  function init() {
    document.querySelectorAll(".service-card").forEach((card) => {
      card.addEventListener("click", () => {
        const title = card.querySelector(".service-card__title")?.textContent;
        if (title) Toast.show(`Learn more about: ${title}`, "⭐");
      });
    });
  }
  return { init };
})();

// ── Hero pills interaction ────────────────────────────────
const HeroPills = (() => {
  function init() {
    document.querySelectorAll(".service-pill").forEach((pill, i) => {
      setTimeout(() => {
        pill.classList.toggle("active", i === 0);
      }, i * 80);
      pill.addEventListener("click", () => {
        document
          .querySelectorAll(".service-pill")
          .forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
      });
    });
  }
  return { init };
})();

// ── Resource links ────────────────────────────────────────
const Resources = (() => {
  function init() {
    document.querySelectorAll(".resource-card__action").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const title = btn
          .closest(".resource-card")
          ?.querySelector(".resource-card__title")?.textContent;
        Toast.show(`Opening resource: ${title}`, "⭐");
      });
    });
  }
  return { init };
})();

// ── Hero Image Flipper ────────────────────────────────────
const HeroFlipper = (() => {
  const INTERVAL = 1000;
  let current = 0,
    timer = null;

  function goTo(index) {
    const slides = document.querySelectorAll(".hero-flipper__slide");
    const dots = document.querySelectorAll(".hero-flipper__dot");
    if (!slides.length) return;
    slides[current].classList.remove("active");
    dots[current]?.classList.remove("active");
    dots[current]?.setAttribute("aria-selected", "false");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("active");
    dots[current]?.classList.add("active");
    dots[current]?.setAttribute("aria-selected", "true");
  }

  function start() {
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  }

  function pause() {
    clearInterval(timer);
  }

  function init() {
    const wrap = document.querySelector(".hero-flipper");
    if (!wrap) return;
    document.querySelectorAll(".hero-flipper__dot").forEach((dot) => {
      dot.addEventListener("click", () => {
        pause();
        goTo(parseInt(dot.dataset.slide));
        start();
      });
    });
    wrap.addEventListener("mouseenter", pause);
    wrap.addEventListener("mouseleave", start);
    wrap.addEventListener("touchstart", pause, { passive: true });
    wrap.addEventListener("touchend", start, { passive: true });
    start();
  }

  return { init };
})();

// ── Gallery Filter & Lightbox ─────────────────────────────
const GalleryManager = (() => {
  function init() {
    const filterBtns = document.querySelectorAll(".gallery-filter-btn");
    const cards = document.querySelectorAll(".gallery-card");
    const emptyState = document.getElementById("gallery-empty");
    const lightbox = document.getElementById("lightbox");
    const lbClose = document.getElementById("lb-close");
    if (!filterBtns.length) return;

    let activeFilter = "all";
    let lbData = [],
      lbIndex = 0;

    // ── Filter ──
    function applyFilter(filter) {
      activeFilter = filter;
      let visible = 0;
      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hidden", !match);
        if (match) visible++;
      });
      if (emptyState) emptyState.classList.toggle("visible", visible === 0);
      filterBtns.forEach((b) =>
        b.classList.toggle("active", b.dataset.filter === filter),
      );
    }

    filterBtns.forEach((btn) =>
      btn.addEventListener("click", () => applyFilter(btn.dataset.filter)),
    );

    // ── Lightbox ──
    function buildLbData() {
      lbData = Array.from(
        document.querySelectorAll(".gallery-card:not(.hidden)"),
      ).map((c) => ({
        title: c.dataset.title,
        desc: c.dataset.desc,
        date: c.dataset.date,
        time: c.dataset.time,
        cat: c.dataset.cat,
        loc: c.dataset.loc,
        emoji: c.dataset.emoji,
        bg: c
          .querySelector(".gallery-card__img")
          .className.split(" ")
          .find((cl) => cl.startsWith("gi-")),
      }));
    }

    function openLightbox(index) {
      buildLbData();
      if (!lbData.length) return;
      lbIndex = ((index % lbData.length) + lbData.length) % lbData.length;
      const d = lbData[lbIndex];
      document.getElementById("lb-img-emoji").textContent = d.emoji;
      const imgEl = document.getElementById("lb-img");
      imgEl.className = "lightbox__img " + (d.bg || "");
      document.getElementById("lb-cat").textContent = d.cat;
      document.getElementById("lb-title").textContent = d.title;
      document.getElementById("lb-desc").textContent = d.desc;
      document.getElementById("lb-date").textContent = d.date;
      document.getElementById("lb-time").textContent = d.time;
      document.getElementById("lb-loc").textContent = d.loc;
      document.getElementById("lb-catval").textContent = d.cat;
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
      if (lbClose) lbClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        buildLbData();
        const visible = Array.from(
          document.querySelectorAll(".gallery-card:not(.hidden)"),
        );
        openLightbox(visible.indexOf(card));
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });

    if (lbClose) lbClose.addEventListener("click", closeLightbox);
    if (lightbox)
      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
      });
    const lbPrev = document.getElementById("lb-prev");
    const lbNext = document.getElementById("lb-next");
    if (lbPrev)
      lbPrev.addEventListener("click", () => openLightbox(lbIndex - 1));
    if (lbNext)
      lbNext.addEventListener("click", () => openLightbox(lbIndex + 1));

    document.addEventListener("keydown", (e) => {
      if (!lightbox || !lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") openLightbox(lbIndex - 1);
      if (e.key === "ArrowRight") openLightbox(lbIndex + 1);
    });
  }

  return { init };
})();

// ── Init ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  ThemeManager.init();
  NavManager.init();
  RevealManager.init();
  BackTop.init();
  CounterManager.init();
  FormManager.init();
  ContactForm.init();
  ServiceCards.init();
  HeroPills.init();
  Resources.init();
  HeroFlipper.init();
  GalleryManager.init();
});
