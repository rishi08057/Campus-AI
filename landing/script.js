/* ═══════════════════════════════════════════════════════════════
   CampusAI Landing — Script
   ═══════════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  /* ──────────────── Utilities ──────────────── */
  const qs  = (s, p = document) => p.querySelector(s);
  const qsa = (s, p = document) => [...p.querySelectorAll(s)];
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ══════════════════════════════════════════════════════════
     1. CUSTOM CURSOR
     ══════════════════════════════════════════════════════════ */
  const cursor   = qs("#cursor");
  const follower = qs("#cursorFollower");
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top  = mouseY + "px";
  });

  (function animateFollower() {
    followerX = lerp(followerX, mouseX, 0.12);
    followerY = lerp(followerY, mouseY, 0.12);
    follower.style.left = followerX + "px";
    follower.style.top  = followerY + "px";
    requestAnimationFrame(animateFollower);
  })();

  /* Hover state on interactive elements */
  qsa("a, button, .agent-card, input").forEach((el) => {
    el.addEventListener("mouseenter", () => follower.classList.add("hover"));
    el.addEventListener("mouseleave", () => follower.classList.remove("hover"));
  });

  /* ══════════════════════════════════════════════════════════
     2. NAV SCROLL EFFECT
     ══════════════════════════════════════════════════════════ */
  const nav = qs("#nav");
  const onNavScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  };
  window.addEventListener("scroll", onNavScroll, { passive: true });
  onNavScroll();

  /* ══════════════════════════════════════════════════════════
     3. HERO TEXT REVEAL
     ══════════════════════════════════════════════════════════ */
  const heroWords   = qsa(".word");
  const heroEyebrow = qs(".hero-eyebrow");
  const heroSub     = qs(".hero-sub");
  const heroCTA     = qs(".hero-content .hero-cta-group") || qs(".hero-content .btn-primary");

  setTimeout(() => {
    heroEyebrow?.classList.add("visible");
    heroWords.forEach((w, i) => {
      setTimeout(() => w.classList.add("visible"), 120 * i);
    });
    setTimeout(() => heroSub?.classList.add("visible"), 200);
    setTimeout(() => heroCTA?.classList.add("visible"), 400);
  }, 300);

  /* ══════════════════════════════════════════════════════════
     4. SCROLL-PINNED AGENTS
     ══════════════════════════════════════════════════════════ */
  const agentsWrapper = qs("#agents-wrapper");
  const agentCards    = qsa(".agent-card");
  const agentLabels   = qsa(".agents-content .anim-fade-up");

  function updateAgents() {
    if (!agentsWrapper) return;
    const rect     = agentsWrapper.getBoundingClientRect();
    const total    = agentsWrapper.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / total));

    /* Reveal text elements at the start */
    agentLabels.forEach((el) => {
      if (progress > 0.02) el.classList.add("visible");
    });

    /* Reveal cards sequentially */
    const count   = agentCards.length;
    const perCard = 1 / (count + 0.5);       // leave a bit of buffer at end
    agentCards.forEach((card, i) => {
      const threshold = perCard * (i + 0.5);
      if (progress >= threshold) {
        card.classList.add("visible");
      } else {
        card.classList.remove("visible");
      }
    });
  }

  window.addEventListener("scroll", updateAgents, { passive: true });
  updateAgents();

  /* ══════════════════════════════════════════════════════════
     5. INTERSECTION OBSERVER — generic .anim-fade-up
     ══════════════════════════════════════════════════════════ */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  /* Observe all generic anim elements EXCEPT those inside
     agents-content (handled by scroll-pin logic above). */
  qsa(".anim-fade-up").forEach((el) => {
    if (!el.closest(".agents-content")) {
      revealObserver.observe(el);
    }
  });

  /* ══════════════════════════════════════════════════════════
     6. CHAT TYPING ANIMATION
     ══════════════════════════════════════════════════════════ */
  const chatMessages = qs("#chatMessages");
  let chatPlayed = false;

  const conversation = [
    { role: "student", text: "I need help finding events happening this week on campus." },
    { role: "ai", route: "Events Agent", text: "I found 3 events this week! 🎉 There's a <b>Tech Talk</b> on Wednesday, an <b>Art Exhibition</b> opening Thursday, and a <b>Career Fair</b> on Friday. Want me to add any to your calendar?" },
    { role: "student", text: "Yes, add the Career Fair please!" },
    { role: "ai", route: "Events Agent", text: "Done! I've added the <b>Career Fair</b> to your calendar for Friday at 10 AM. I also noticed it's related to your major — would you like me to prepare some tips from the <b>Placement Agent</b>?" },
  ];

  function createTypingIndicator() {
    const wrapper = document.createElement("div");
    wrapper.className = "msg ai";
    wrapper.innerHTML = `
      <div class="msg-avatar">AI</div>
      <div class="typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>`;
    return wrapper;
  }

  function addMessage(msg) {
    return new Promise((resolve) => {
      const el = document.createElement("div");
      el.className = `msg ${msg.role}`;
      const avatarLabel = msg.role === "ai" ? "AI" : "You";
      let routeHTML = "";
      if (msg.route) {
        routeHTML = `<div class="msg-route">${msg.route}</div>`;
      }
      el.innerHTML = `
        <div class="msg-avatar">${avatarLabel}</div>
        <div class="msg-bubble">${routeHTML}${msg.text}</div>`;
      chatMessages.appendChild(el);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      setTimeout(resolve, 400);
    });
  }

  async function playChat() {
    if (chatPlayed || !chatMessages) return;
    chatPlayed = true;

    for (const msg of conversation) {
      if (msg.role === "ai") {
        /* Show typing indicator */
        const typing = createTypingIndicator();
        chatMessages.appendChild(typing);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        await new Promise((r) => setTimeout(r, 1400 + Math.random() * 600));
        typing.remove();
      } else {
        await new Promise((r) => setTimeout(r, 600));
      }
      await addMessage(msg);
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  const chatObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          playChat();
          chatObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  const chatWindow = qs("#chatWindow");
  if (chatWindow) chatObserver.observe(chatWindow);

  /* ══════════════════════════════════════════════════════════
     7. COUNT-UP STATS
     ══════════════════════════════════════════════════════════ */
  function animateCountUp(el) {
    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix || "";
    const isDecimal = el.dataset.decimal === "true";
    const duration = 2000;
    const start    = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      /* ease-out quad */
      const eased = 1 - (1 - progress) * (1 - progress);
      const value = eased * target;

      if (isDecimal) {
        el.textContent = value.toFixed(1) + suffix;
      } else {
        el.textContent = Math.floor(value).toLocaleString() + suffix;
      }

      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          qsa(".stat-number", entry.target).forEach(animateCountUp);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  const statsSection = qs("#stats");
  if (statsSection) statsObserver.observe(statsSection);

  /* ══════════════════════════════════════════════════════════
     8. SMOOTH SCROLL FOR ANCHOR LINKS
     ══════════════════════════════════════════════════════════ */
  qsa('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id === "#") return;
      const target = qs(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

})();
