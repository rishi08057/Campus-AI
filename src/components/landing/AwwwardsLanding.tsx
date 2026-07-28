"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import "./awwwards.css"; // Ensure this path matches the location

export default function AwwwardsLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    const qs = (s: string) => containerRef.current!.querySelector(s) as HTMLElement | null;
    const qsa = (s: string) => Array.from(containerRef.current!.querySelectorAll(s)) as HTMLElement[];
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // 1. CUSTOM CURSOR
    const cursor = qs(".cursor");
    const follower = qs(".cursor-follower");
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursor) {
        cursor.style.left = mouseX + "px";
        cursor.style.top = mouseY + "px";
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    const animateFollower = () => {
      followerX = lerp(followerX, mouseX, 0.12);
      followerY = lerp(followerY, mouseY, 0.12);
      if (follower) {
        follower.style.left = followerX + "px";
        follower.style.top = followerY + "px";
      }
      animationFrameId = requestAnimationFrame(animateFollower);
    };
    animateFollower();

    // Hover state
    const interactives = qsa("a, button, .agent-card, input");
    const addHover = () => follower?.classList.add("hover");
    const removeHover = () => follower?.classList.remove("hover");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    // 2. NAV SCROLL EFFECT
    const nav = qs(".nav");
    const onNavScroll = () => {
      if (nav) {
        nav.classList.toggle("scrolled", window.scrollY > 60);
      }
    };
    window.addEventListener("scroll", onNavScroll, { passive: true });
    onNavScroll();

    // 3. HERO TEXT REVEAL
    const heroWords = qsa(".word");
    const heroEyebrow = qs(".hero-eyebrow");
    const heroSub = qs(".hero-sub");
    const heroCTA = qs(".hero-content .hero-cta-group") || qs(".hero-content .btn-primary");

    const heroTimeout = setTimeout(() => {
      heroEyebrow?.classList.add("visible");
      heroWords.forEach((w, i) => {
        setTimeout(() => w.classList.add("visible"), 120 * i);
      });
      setTimeout(() => heroSub?.classList.add("visible"), 200);
      setTimeout(() => heroCTA?.classList.add("visible"), 400);
    }, 300);

    // 4. SCROLL-PINNED AGENTS (slide-based, one agent at a time)
    const agentsWrapper = qs(".agents-wrapper");
    const agentSlides = qsa(".agent-slide");
    const agentLabels = qsa(".agents-header .anim-fade-up");
    const progressFill = qs(".agents-progress-fill");
    const progressDots = qsa(".agents-dot");

    const updateAgents = () => {
      if (!agentsWrapper) return;
      const rect = agentsWrapper.getBoundingClientRect();
      const total = agentsWrapper.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, total > 0 ? scrolled / total : 0));

      // Show header labels as soon as we enter
      agentLabels.forEach((el) => {
        if (progress > 0.01) el.classList.add("visible");
      });

      // Update progress bar
      if (progressFill) {
        progressFill.style.height = (progress * 100) + "%";
      }

      // Determine which slide is active (each slide gets equal scroll range)
      const count = agentSlides.length;
      if (count > 0) {
        const activeIndex = Math.min(count - 1, Math.floor(progress * count));

        agentSlides.forEach((slide, i) => {
          slide.classList.toggle("active", i === activeIndex);
        });

        // Update dots
        progressDots.forEach((dot, i) => {
          dot.classList.toggle("active", i === activeIndex);
          dot.classList.toggle("done", i < activeIndex);
        });
      }
    };
    window.addEventListener("scroll", updateAgents, { passive: true });
    updateAgents();

    // 5. INTERSECTION OBSERVER
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
    qsa(".anim-fade-up").forEach((el) => {
      if (!el.closest(".agents-content")) revealObserver.observe(el);
    });

    // 6. CHAT DEMO
    const chatMessages = qs(".chat-messages");
    let chatPlayed = false;
    const conversation = [
      { role: "student", text: "I need help finding events happening this week on campus." },
      { role: "ai", route: "Events Agent", text: "I found 3 events this week! 🎉 There's a <b>Tech Talk</b> on Wednesday, an <b>Art Exhibition</b> opening Thursday, and a <b>Career Fair</b> on Friday. Want me to add any to your calendar?" },
      { role: "student", text: "Yes, add the Career Fair please!" },
      { role: "ai", route: "Events Agent", text: "Done! I've added the <b>Career Fair</b> to your calendar for Friday at 10 AM. I also noticed it's related to your major — would you like me to prepare some tips from the <b>Placement Agent</b>?" },
    ];

    const createTypingIndicator = () => {
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
    };

    const addMessage = (msg: any) => {
      return new Promise<void>((resolve) => {
        const el = document.createElement("div");
        el.className = `msg ${msg.role}`;
        const avatarLabel = msg.role === "ai" ? "AI" : "You";
        const routeHTML = msg.route ? `<div class="msg-route">${msg.route}</div>` : "";
        el.innerHTML = `
          <div class="msg-avatar">${avatarLabel}</div>
          <div class="msg-bubble">${routeHTML}${msg.text}</div>`;
        chatMessages?.appendChild(el);
        if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
        setTimeout(resolve, 400);
      });
    };

    const playChat = async () => {
      if (chatPlayed || !chatMessages) return;
      chatPlayed = true;

      for (const msg of conversation) {
        if (msg.role === "ai") {
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
    };

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
    const chatWindow = qs(".chat-window");
    if (chatWindow) chatObserver.observe(chatWindow);

    // 7. COUNT-UP STATS
    const animateCountUp = (el: HTMLElement) => {
      const target = parseFloat(el.dataset.target || "0");
      const suffix = el.dataset.suffix || "";
      const isDecimal = el.dataset.decimal === "true";
      const duration = 2000;
      const start = performance.now();

      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 2);
        const value = eased * target;

        if (isDecimal) {
          el.textContent = value.toFixed(1) + suffix;
        } else {
          el.textContent = Math.floor(value).toLocaleString() + suffix;
        }

        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const numbers = Array.from(entry.target.querySelectorAll(".stat-number")) as HTMLElement[];
            numbers.forEach(animateCountUp);
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    const statsSection = qs(".stats-section");
    if (statsSection) statsObserver.observe(statsSection);

    // 8. SMOOTH SCROLL
    const anchorLinks = qsa('a[href^="#"]');
    const onAnchorClick = (e: Event) => {
      const a = e.currentTarget as HTMLAnchorElement;
      const id = a.getAttribute("href");
      if (id === "#") return;
      const target = id ? qs(id.replace('#', '.')) || qs(id) : null;
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    anchorLinks.forEach(a => a.addEventListener("click", onAnchorClick));

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
      });
      window.removeEventListener("scroll", onNavScroll);
      window.removeEventListener("scroll", updateAgents);
      clearTimeout(heroTimeout);
      revealObserver.disconnect();
      chatObserver.disconnect();
      statsObserver.disconnect();
      anchorLinks.forEach(a => a.removeEventListener("click", onAnchorClick));
    };
  }, []);

  return (
    <div className="awwwards-landing" ref={containerRef}>
      <div className="cursor"></div>
      <div className="cursor-follower"></div>

      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">Campus<span>AI</span></Link>
          <div className="nav-links">
            <a href="#agents-wrapper">Agents</a>
            <a href="#how">How it works</a>
            <a href="#chat">Demo</a>
          </div>
          <div className="nav-actions">
            <Link href="/login" className="btn btn-nav-secondary">Sign In</Link>
            <Link href="/signup" className="btn btn-nav">Get Early Access</Link>
          </div>
        </div>
      </nav>

      <section className="hero" id="hero">
        <div className="hero-blobs" aria-hidden="true">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
        <div className="hero-content">
          <p className="hero-eyebrow">Multi-agent AI for universities</p>
          <h1 className="hero-headline">
            <span className="word-wrap"><span className="word">One</span></span>&nbsp;
            <span className="word-wrap"><span className="word">AI.</span></span>&nbsp;
            <span className="word-wrap"><span className="word">Every</span></span>&nbsp;
            <span className="word-wrap"><span className="word">part</span></span>&nbsp;
            <span className="word-wrap"><span className="word">of</span></span><br />
            <span className="word-wrap"><span className="word">campus</span></span>&nbsp;
            <span className="word-wrap"><span className="word">life.</span></span>
          </h1>
          <p className="hero-sub">The intelligent platform that routes your questions to specialist AI agents&nbsp;— so&nbsp;you get accurate, grounded answers about every corner of university life.</p>
          <div className="hero-cta-group">
            <Link href="/signup" className="btn btn-primary">
              <span>Get Early Access</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <Link href="/login" className="btn btn-secondary">
              <span>Sign In</span>
            </Link>
          </div>
        </div>
        <div className="scroll-indicator" aria-label="Scroll down">
          <span className="scroll-text">Scroll</span>
          <div className="scroll-track">
            <div className="scroll-thumb"></div>
          </div>
        </div>
      </section>

      <section className="agents-wrapper" id="agents-wrapper">
        <div className="agents-sticky">
          {/* Header */}
          <div className="agents-header">
            <span className="section-label anim-fade-up">AI Agents</span>
            <h2 className="section-title anim-fade-up">Meet your AI team</h2>
          </div>

          {/* Progress indicator on left side */}
          <div className="agents-progress">
            <div className="agents-progress-track">
              <div className="agents-progress-fill"></div>
            </div>
            <div className="agents-dots">
              <button className="agents-dot" data-index="0" aria-label="Events Agent"></button>
              <button className="agents-dot" data-index="1" aria-label="Academic Agent"></button>
              <button className="agents-dot" data-index="2" aria-label="Placement Agent"></button>
              <button className="agents-dot" data-index="3" aria-label="Wellness Agent"></button>
            </div>
          </div>

          {/* Slide 0 — Events (card LEFT, description RIGHT) */}
          <div className="agent-slide" data-index="0">
            <div className="agent-slide-card">
              <div className="agent-card-large" style={{ '--card-accent': '#fef3c7', '--card-accent-dark': '#f59e0b' } as React.CSSProperties}>
                <div className="agent-icon-large">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--card-accent-dark)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                    <circle cx="12" cy="16" r="1.5" fill="var(--card-accent-dark)" stroke="none"/>
                  </svg>
                </div>
                <span className="agent-card-label">Agent 01</span>
                <div className="card-glow-large" style={{ background: '#fef3c7' }}></div>
              </div>
            </div>
            <div className="agent-slide-info">
              <h3 className="agent-slide-name">Events Agent</h3>
              <p className="agent-slide-desc">Your personal campus social curator. The Events Agent scans every corner of university life — from club meetings to guest lectures, hackathons to cultural festivals — and surfaces the ones that match your interests.</p>
              <ul className="agent-features">
                <li><span className="feature-icon">📅</span>Personalized event discovery</li>
                <li><span className="feature-icon">🔔</span>Smart reminders &amp; calendar sync</li>
                <li><span className="feature-icon">👥</span>Club &amp; organization matching</li>
              </ul>
            </div>
          </div>

          {/* Slide 1 — Academic (card RIGHT, description LEFT) */}
          <div className="agent-slide reverse" data-index="1">
            <div className="agent-slide-card">
              <div className="agent-card-large" style={{ '--card-accent': '#dbeafe', '--card-accent-dark': '#3b82f6' } as React.CSSProperties}>
                <div className="agent-icon-large">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--card-accent-dark)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    <line x1="9" y1="8" x2="16" y2="8"/><line x1="9" y1="12" x2="14" y2="12"/>
                  </svg>
                </div>
                <span className="agent-card-label">Agent 02</span>
                <div className="card-glow-large" style={{ background: '#dbeafe' }}></div>
              </div>
            </div>
            <div className="agent-slide-info">
              <h3 className="agent-slide-name">Academic Agent</h3>
              <p className="agent-slide-desc">Your always-on study companion. The Academic Agent builds customized study plans, finds the best resources for every subject, tracks deadlines, and gives smart recommendations to keep you ahead in all your courses.</p>
              <ul className="agent-features">
                <li><span className="feature-icon">📚</span>Customized study plans</li>
                <li><span className="feature-icon">⏰</span>Deadline &amp; assignment tracking</li>
                <li><span className="feature-icon">🎯</span>Smart resource recommendations</li>
              </ul>
            </div>
          </div>

          {/* Slide 2 — Placement (card LEFT, description RIGHT) */}
          <div className="agent-slide" data-index="2">
            <div className="agent-slide-card">
              <div className="agent-card-large" style={{ '--card-accent': '#d1fae5', '--card-accent-dark': '#10b981' } as React.CSSProperties}>
                <div className="agent-icon-large">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--card-accent-dark)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2"/>
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                    <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
                  </svg>
                </div>
                <span className="agent-card-label">Agent 03</span>
                <div className="card-glow-large" style={{ background: '#d1fae5' }}></div>
              </div>
            </div>
            <div className="agent-slide-info">
              <h3 className="agent-slide-name">Placement Agent</h3>
              <p className="agent-slide-desc">Career guidance powered by AI. From polishing your resume to running mock interviews, discovering internships, and matching you with job openings aligned to your skills — your career co-pilot is always ready.</p>
              <ul className="agent-features">
                <li><span className="feature-icon">📝</span>Resume review &amp; optimization</li>
                <li><span className="feature-icon">💼</span>Curated job &amp; internship matches</li>
                <li><span className="feature-icon">🎤</span>Mock interview preparation</li>
              </ul>
            </div>
          </div>

          {/* Slide 3 — Wellness (card RIGHT, description LEFT) */}
          <div className="agent-slide reverse" data-index="3">
            <div className="agent-slide-card">
              <div className="agent-card-large" style={{ '--card-accent': '#ede9fe', '--card-accent-dark': '#8b5cf6' } as React.CSSProperties}>
                <div className="agent-icon-large">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--card-accent-dark)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </div>
                <span className="agent-card-label">Agent 04</span>
                <div className="card-glow-large" style={{ background: '#ede9fe' }}></div>
              </div>
            </div>
            <div className="agent-slide-info">
              <h3 className="agent-slide-name">Wellness Agent</h3>
              <p className="agent-slide-desc">Your campus wellness companion. Access mental health resources, learn stress management techniques, find counseling services, and receive personalized self-care recommendations — all in a safe, confidential space.</p>
              <ul className="agent-features">
                <li><span className="feature-icon">🧘</span>Stress management &amp; mindfulness</li>
                <li><span className="feature-icon">💚</span>Mental health resource finder</li>
                <li><span className="feature-icon">🔒</span>Confidential &amp; judgment-free</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="chat-section" id="chat">
        <div className="chat-layout">
          <div className="chat-copy">
            <span className="section-label anim-fade-up">Live Demo</span>
            <h2 className="section-title anim-fade-up">See it in action</h2>
            <p className="section-sub anim-fade-up">Watch how CampusAI routes your question to the right specialist agent and delivers an accurate answer in seconds.</p>
          </div>

          <div className="chat-window anim-fade-up">
            <div className="chat-header">
              <div className="chat-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 2a5 5 0 0 1 5 5v2a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z"/><path d="M20 21v-2a4 4 0 0 0-3-3.87"/><path d="M4 21v-2a4 4 0 0 1 3-3.87"/></svg>
              </div>
              <div className="chat-info">
                <span className="chat-name">CampusAI</span>
                <span className="chat-status"><span className="status-dot"></span>Online</span>
              </div>
              <div className="chat-header-dots">
                <span></span><span></span><span></span>
              </div>
            </div>

            <div className="chat-messages">
              {/* Messages injected by JS */}
            </div>

            <div className="chat-input-bar">
              <input type="text" placeholder="Ask CampusAI anything..." disabled />
              <button className="chat-send-btn" aria-label="Send message">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="how-section" id="how">
        <div className="how-content">
          <span className="section-label anim-fade-up">How It Works</span>
          <h2 className="section-title anim-fade-up">Three steps to any answer</h2>

          <div className="how-steps">
            <div className="how-step anim-fade-up">
              <div className="step-number-ring">
                <span className="step-number">01</span>
              </div>
              <h3 className="step-title">Ask</h3>
              <p className="step-desc">Type any question about campus life in natural language. No menus, no forms&nbsp;— just ask.</p>
            </div>

            <div className="how-connector anim-fade-up" aria-hidden="true">
              <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
                <path d="M0 12h40" stroke="url(#connGrad)" strokeWidth="2" strokeDasharray="4 4"/>
                <path d="M36 6l6 6-6 6" stroke="url(#connGrad)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <defs><linearGradient id="connGrad" x1="0" y1="12" x2="48" y2="12"><stop stopColor="#6366f1"/><stop offset="1" stopColor="#a78bfa"/></linearGradient></defs>
              </svg>
            </div>

            <div className="how-step anim-fade-up">
              <div className="step-number-ring">
                <span className="step-number">02</span>
              </div>
              <h3 className="step-title">Route</h3>
              <p className="step-desc">Your query is intelligently routed to the specialist AI agent best suited to help.</p>
            </div>

            <div className="how-connector anim-fade-up" aria-hidden="true">
              <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
                <path d="M0 12h40" stroke="url(#connGrad2)" strokeWidth="2" strokeDasharray="4 4"/>
                <path d="M36 6l6 6-6 6" stroke="url(#connGrad2)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <defs><linearGradient id="connGrad2" x1="0" y1="12" x2="48" y2="12"><stop stopColor="#6366f1"/><stop offset="1" stopColor="#a78bfa"/></linearGradient></defs>
              </svg>
            </div>

            <div className="how-step anim-fade-up">
              <div className="step-number-ring">
                <span className="step-number">03</span>
              </div>
              <h3 className="step-title">Answer</h3>
              <p className="step-desc">Get a grounded, accurate answer with sources&nbsp;you&nbsp;can trust. Every time.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section" id="stats">
        <div className="stats-inner">
          <div className="stat anim-fade-up">
            <span className="stat-number" data-target="50" data-suffix="K+">0</span>
            <span className="stat-label">Active Students</span>
          </div>
          <div className="stat-divider" aria-hidden="true"></div>
          <div className="stat anim-fade-up">
            <span className="stat-number" data-target="4.9" data-decimal="true">0</span>
            <span className="stat-label">User Rating</span>
          </div>
          <div className="stat-divider" aria-hidden="true"></div>
          <div className="stat anim-fade-up">
            <span className="stat-number" data-target="200" data-suffix="+">0</span>
            <span className="stat-label">Universities</span>
          </div>
          <div className="stat-divider" aria-hidden="true"></div>
          <div className="stat anim-fade-up">
            <span className="stat-number" data-target="2" data-suffix="M+">0</span>
            <span className="stat-label">Queries Answered</span>
          </div>
        </div>
      </section>

      <footer className="footer" id="footer">
        <div className="footer-blobs" aria-hidden="true">
          <div className="blob blob-footer-1"></div>
          <div className="blob blob-footer-2"></div>
        </div>
        <div className="footer-content">
          <h2 className="footer-headline anim-fade-up">Ready to transform<br/>your campus experience?</h2>
          <div className="footer-cta-group anim-fade-up">
            <Link href="/signup" className="btn btn-primary btn-large">
              <span>Get Started — It's Free</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <p className="footer-signin-text">
              Already have an account? <Link href="/login" className="footer-signin-link">Sign In</Link>
            </p>
          </div>
          <nav className="footer-links anim-fade-up" aria-label="Footer navigation">
            <a href="#">About</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </nav>
          <p className="footer-copy">© 2026 CampusAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
