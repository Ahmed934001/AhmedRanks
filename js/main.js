/* ==========================================================================
   AHMED RANKS — main.js
   Core UI engine: navigation, GSAP motion, counters, countdown, confetti,
   Toastify social-proof, Fancybox gallery, Swiper testimonials, tilt/glass
   sheen and WhatsApp form routing.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     0. CONFIG & HELPERS
  --------------------------------------------------------------------- */
  const CONFIG = {
    phoneDisplay: "0334 3706275",
    phoneTel: "+923343706275",
    whatsapp: "923343706275",
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches
  };

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  /* ---------------------------------------------------------------------
     1. NAVBAR — frosted state on scroll + scroll-progress bar
  --------------------------------------------------------------------- */
  const navbar = $("#mainNav");
  const progress = $("#scrollProgress");

  function onScroll() {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 40);
    if (progress) {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      progress.style.transform = `scaleX(${max > 0 ? h.scrollTop / max : 0})`;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Active nav link highlighting via IntersectionObserver */
  const sections = $$("section[id]");
  if (sections.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        $$('.navbar-glass .nav-link, .offcanvas-glass .nav-link').forEach((l) => {
          l.classList.toggle("active", l.getAttribute("href") === `#${e.target.id}`);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => io.observe(s));
  }

  /* ---------------------------------------------------------------------
     2. GSAP — register plugin + scroll reveals
  --------------------------------------------------------------------- */
  const hasGSAP = typeof window.gsap !== "undefined";
  if (hasGSAP && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    /* Entrance reveal variants (data-reveal="up|left|right|zoom|flip") */
    $$("[data-reveal]").forEach((el) => {
      const variant = el.dataset.reveal || "up";
      const delay = parseFloat(el.dataset.revealDelay || 0);
      const from = { opacity: 0, duration: 1, ease: "power3.out", delay };
      if (variant === "up")    Object.assign(from, { y: 56 });
      if (variant === "left")  Object.assign(from, { x: -64 });
      if (variant === "right") Object.assign(from, { x: 64 });
      if (variant === "zoom")  Object.assign(from, { scale: .88, y: 30 });
      if (variant === "flip")  Object.assign(from, { rotationX: 55, y: 46, transformPerspective: 900 });
      gsap.from(el, { ...from, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    });

    /* Staggered groups (cards grids) */
    $$("[data-reveal-group]").forEach((group) => {
      gsap.from(group.children, {
        opacity: 0, y: 60, scale: .96, duration: .9, stagger: .12, ease: "power3.out",
        scrollTrigger: { trigger: group, start: "top 86%", once: true }
      });
    });

    /* Hero intro timeline */
    const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
    heroTl
      .from(".hero .eyebrow", { y: 30, opacity: 0, duration: .8 })
      .from(".hero-title .line", { y: 70, opacity: 0, duration: 1, stagger: .12 }, "-=.4")
      .from(".hero-sub", { y: 40, opacity: 0, duration: .9 }, "-=.6")
      .from(".hero-badges .hero-badge", { y: 24, opacity: 0, duration: .6, stagger: .08 }, "-=.5")
      .from(".hero-cta > *", { y: 26, opacity: 0, duration: .7, stagger: .1 }, "-=.4")
      .from(".hero-visual", { opacity: 0, scale: .9, rotationY: -12, duration: 1.2, transformPerspective: 1200 }, "-=.7")
      .from(".float-chip", { scale: 0, opacity: 0, duration: .7, stagger: .15, ease: "back.out(2)" }, "-=.6");

    /* Aurora blob drift (continuous, cheap transforms) */
    if (!CONFIG.reducedMotion) {
      $$(".blob").forEach((b, i) => {
        gsap.to(b, {
          x: () => rand(-90, 90), y: () => rand(-70, 70), scale: () => 1 + Math.random() * .35,
          duration: 9 + i * 2, repeat: -1, yoyo: true, ease: "sine.inOut"
        });
      });
    }

    /* Process timeline line fill */
    const lineFill = $(".process-line-fill");
    if (lineFill) {
      gsap.to(lineFill, {
        scaleY: 1, ease: "none",
        scrollTrigger: { trigger: ".process-track", start: "top 70%", end: "bottom 60%", scrub: .6 }
      });
    }

    /* LinkedIn score bars */
    $$(".li-bar span").forEach((bar) => {
      ScrollTrigger.create({
        trigger: bar, start: "top 90%", once: true,
        onEnter: () => { bar.style.width = bar.dataset.width || "90%"; }
      });
    });

    /* Parallax on case-study / section images */
    $$("[data-parallax]").forEach((el) => {
      gsap.to(el, {
        y: () => -60, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true }
      });
    });
  }

  /* ---------------------------------------------------------------------
     2b. BUTTER-SMOOTH SCROLLING (Lenis) — synced with GSAP & ScrollTrigger
  --------------------------------------------------------------------- */
  if (window.Lenis && hasGSAP && window.ScrollTrigger && !CONFIG.reducedMotion) {
    const lenis = new Lenis({
      duration: 1.15,          // inertia length — elegant, not floaty
      smoothWheel: true,
      touchMultiplier: 1.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
    /* Lenis owns scrolling now — disable native CSS smooth to avoid fights */
    document.documentElement.style.scrollBehavior = "auto";
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);

    /* Anchor links glide to their section with navbar offset */
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -92, duration: 1.35 });
        /* keep offcanvas menus closed when navigating from them */
        const open = document.querySelector(".offcanvas.show");
        if (open && window.bootstrap) bootstrap.Offcanvas.getInstance(open)?.hide();
      });
    });
    window.ARLenis = lenis; // exposed for debugging / future use
  }

  /* ---------------------------------------------------------------------
     3. ANIMATED COUNTERS (stats)
  --------------------------------------------------------------------- */
  const counters = $$("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const prefix = el.dataset.prefix || "";
        const dur = 2000;
        const t0 = performance.now();
        (function tick(now) {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 4); // easeOutQuart
          el.textContent = prefix + Math.round(target * eased).toLocaleString("en-PK") + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
        cio.unobserve(el);
      });
    }, { threshold: .5 });
    counters.forEach((c) => cio.observe(c));
  }

  /* ---------------------------------------------------------------------
     4. HERO TYPE-ROTATOR (words that sell)
  --------------------------------------------------------------------- */
  const rotator = $("#rotator");
  if (rotator) {
    const words = (rotator.dataset.words || "leads,revenue,rankings,customers,pipe").split(",");
    let wi = 0, ci = words[0].length, deleting = false;
    (function type() {
      const word = words[wi];
      ci += deleting ? -1 : 1;
      rotator.textContent = word.slice(0, ci);
      let wait = deleting ? 45 : 95;
      if (!deleting && ci === word.length) { wait = 1700; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; wait = 320; }
      setTimeout(type, wait);
    })();
  }

  /* ---------------------------------------------------------------------
     5. 3D TILT + CURSOR SHEEN on glass cards
  --------------------------------------------------------------------- */
  const tiltCards = $$(".tilt");
  if (!CONFIG.reducedMotion && window.matchMedia("(pointer:fine)").matches) {
    tiltCards.forEach((card) => {
      const max = 7; // degrees
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
        card.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translateY(-6px)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
    /* Sheen-only cards (no tilt) still track cursor for the light glare */
    $$(".glass-card:not(.tilt), .glass-light.glass-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      });
    });
  }

  /* ---------------------------------------------------------------------
     6. EVERGREEN DISCOUNT COUNTDOWN (48h, persisted per visitor)
  --------------------------------------------------------------------- */
  function getDeadline() {
    const KEY = "ar_offer_deadline";
    try {
      let end = parseInt(localStorage.getItem(KEY) || "0", 10);
      if (!end || end < Date.now()) {
        end = Date.now() + 48 * 60 * 60 * 1000; // 48 hours from first visit
        try { localStorage.setItem(KEY, String(end)); } catch (e) { /* private mode */ }
      }
      return end;
    } catch (e) {
      /* storage blocked (sandboxed iframes / private mode) — fall back to session deadline */
      return Date.now() + 48 * 60 * 60 * 1000;
    }
  }
  const deadline = getDeadline();
  const cdTargets = $$("[data-countdown]"); // containers with .cd-h .cd-m .cd-s or inline span
  function paintCountdown() {
    let diff = Math.max(0, deadline - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = (n) => String(n).padStart(2, "0");
    cdTargets.forEach((box) => {
      const hh = box.querySelector(".cd-h"), mm = box.querySelector(".cd-m"), ss = box.querySelector(".cd-s");
      if (hh && mm && ss) { hh.textContent = pad(h); mm.textContent = pad(m); ss.textContent = pad(s); }
      else box.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    });
  }
  if (cdTargets.length) { paintCountdown(); setInterval(paintCountdown, 1000); }

  /* ---------------------------------------------------------------------
     7. CONFETTI — celebratory burst on load (+ exposed for CTAs)
  --------------------------------------------------------------------- */
  window.ARConfetti = {
    burst(originX = .5) {
      if (!window.confetti || CONFIG.reducedMotion) return;
      confetti({ particleCount: 90, spread: 75, origin: { x: originX, y: .6 }, colors: ["#9B22FF", "#C082FF", "#B03BFF", "#D49BFF", "#FFFFFF"], disableForReducedMotion: true });
    },
    celebrate() {
      if (!window.confetti || CONFIG.reducedMotion) return;
      const end = Date.now() + 1200;
      (function frame() {
        confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: .7 }, colors: ["#9B22FF", "#C082FF", "#D49BFF"], disableForReducedMotion: true });
        confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: .7 }, colors: ["#D49BFF", "#B03BFF", "#FFFFFF"], disableForReducedMotion: true });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    }
  };
  window.addEventListener("load", () => {
    if (CONFIG.reducedMotion || !window.confetti) return;
    setTimeout(() => {
      confetti({ particleCount: 110, spread: 90, origin: { y: .62 }, colors: ["#9B22FF", "#C082FF", "#B03BFF", "#D49BFF"], disableForReducedMotion: true });
      setTimeout(() => window.ARConfetti.celebrate(), 450);
    }, 700);
  });

  /* ---------------------------------------------------------------------
     8. TOASTIFY — live social-proof purchase notifications (bottom-center)
  --------------------------------------------------------------------- */
  const PROOFS = [
    { flag: "🇵🇰", name: "Ayesha Siddiqui",  city: "Karachi",    svc: "Social Media Management" },
    { flag: "🇵🇰", name: "Bilal Ahmed Khan", city: "Lahore",     svc: "WordPress Website Package" },
    { flag: "🇮🇳", name: "Priya Sharma",     city: "Mumbai",     svc: "Performance Marketing Sprint" },
    { flag: "🇸🇦", name: "Abdulrahman Al-Harbi", city: "Riyadh", svc: "LinkedIn Profile Optimization" },
    { flag: "🇦🇪", name: "Fatima Al-Mansouri", city: "Dubai",    svc: "SEO Growth Retainer" },
    { flag: "🇵🇰", name: "Hamza Tariq",      city: "Islamabad",  svc: "Brand Identity & Logo Design" },
    { flag: "🇮🇳", name: "Rohan Mehta",      city: "Delhi",      svc: "Google Ads Management" },
    { flag: "🇵🇰", name: "Mariam Baloch",    city: "Quetta",     svc: "E-commerce Web Development" },
    { flag: "🇸🇦", name: "Khalid Al-Otaibi", city: "Jeddah",     svc: "Meta Ads Lead Generation" },
    { flag: "🇦🇪", name: "Sara Abdelaziz",   city: "Abu Dhabi",  svc: "UI/UX Design Sprint" },
    { flag: "🇮🇳", name: "Arjun Nair",       city: "Bengaluru",  svc: "Technical SEO Audit" },
    { flag: "🇵🇰", name: "Usman Ghani",      city: "Faisalabad", svc: "Shopify Store Setup" }
  ];
  const TIMES = ["2 minutes ago", "6 minutes ago", "11 minutes ago", "just now", "14 minutes ago", "4 minutes ago"];
  let proofQueue = [];
  function nextProof() {
    if (!proofQueue.length) proofQueue = [...PROOFS].sort(() => Math.random() - .5);
    return proofQueue.pop();
  }
  function showProof() {
    if (!window.Toastify || document.hidden) return;
    const p = nextProof();
    Toastify({
      text: `<span class="proof-flag">${p.flag}</span> <span class="proof-name">${p.name}</span> from ${p.city} purchased <span class="proof-svc">${p.svc}</span><span class="proof-time"><i class="fa-solid fa-circle-check"></i> Verified order · ${TIMES[rand(0, TIMES.length - 1)]}</span>`,
      escapeMarkup: false,
      duration: 6500,
      gravity: "bottom",
      position: "center",
      stopOnFocus: true,
      close: true,          // ✕ dismiss button — visitors can cancel notifications
      offset: { y: 96 },
      className: "ar-proof"
    }).showToast();
  }
  if (window.Toastify) {
    setTimeout(showProof, 9000);   // first proof after landing
    setInterval(showProof, 28000); // steady, non-annoying rhythm (skipped when tab hidden)
  }

  /* ---------------------------------------------------------------------
     9. FANCYBOX — media lightbox binding
  --------------------------------------------------------------------- */
  if (window.Fancybox) {
    Fancybox.bind("[data-fancybox]", {   // covers case studies + certificates
      groupAll: false,
      Toolbar: { display: { left: ["infobar"], middle: ["zoomIn", "zoomOut", "toggle1to1"], right: ["slideshow", "fullScreen", "close"] } },
      Images: { zoom: true },
      Html: { videoRatio: 16 / 9 }
    });
  }

  /* ---------------------------------------------------------------------
     10. SWIPER — testimonial slider
  --------------------------------------------------------------------- */
  if (window.Swiper && $(".testi-swiper")) {
    new Swiper(".testi-swiper", {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      grabCursor: true,
      autoplay: { delay: 5200, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: ".testi-swiper .swiper-pagination", clickable: true },
      navigation: { nextEl: ".testi-next", prevEl: ".testi-prev" },
      breakpoints: { 768: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } }
    });
  }

  /* ---------------------------------------------------------------------
     11. CONTACT FORM → WhatsApp hand-off (never loses a lead)
  --------------------------------------------------------------------- */
  const leadForm = $("#leadForm");
  if (leadForm) {
    leadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(leadForm);
      const msg =
        `*New Growth Request — ahmedranks.com*%0A` +
        `👤 Name: ${encodeURIComponent(data.get("name") || "-")}%0A` +
        `📧 Email: ${encodeURIComponent(data.get("email") || "-")}%0A` +
        `📱 Phone: ${encodeURIComponent(data.get("phone") || "-")}%0A` +
        `🎯 Service: ${encodeURIComponent(data.get("service") || "-")}%0A` +
        `💬 Details: ${encodeURIComponent(data.get("message") || "-")}`;
      window.ARConfetti.burst(.5);
      window.open(`https://wa.me/${CONFIG.whatsapp}?text=${msg}`, "_blank", "noopener");
      leadForm.reset();
      if (window.Toastify) Toastify({ text: "✅ Shukria! Opening WhatsApp so nothing gets lost in email…", duration: 4200, gravity: "bottom", position: "center", close: true, className: "ar-proof" }).showToast();
    });
  }

  /* ---------------------------------------------------------------------
     12. PRICING CTA micro-confetti
  --------------------------------------------------------------------- */
  $$("[data-confetti-click]").forEach((btn) => {
    btn.addEventListener("click", () => window.ARConfetti.burst(Math.random() * .6 + .2));
  });

  /* ---------------------------------------------------------------------
     13. FOOTER YEAR
  --------------------------------------------------------------------- */
  $$(".js-year").forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
