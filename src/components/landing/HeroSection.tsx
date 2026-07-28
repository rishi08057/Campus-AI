"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

export function HeroSection() {
  const fullText = "Campus AI";
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);

  // Mouse-tracking for the glow effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    setDisplayedText("");
    setIsTypingDone(false);
    let index = 0;
    const timer = setInterval(() => {
      index++;
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
      } else {
        setIsTypingDone(true);
        clearInterval(timer);
      }
    }, 120);

    return () => clearInterval(timer);
  }, []);

  const glowBackground = useTransform(
    [springX, springY],
    ([x, y]: number[]) =>
      `radial-gradient(600px circle at ${x}px ${y}px, rgba(99, 102, 241, 0.06), transparent 60%)`
  );

  return (
    <motion.section
      ref={containerRef}
      className="relative flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-4 sm:px-6 lg:px-8 text-center selection:bg-indigo-500/30 selection:text-white overflow-hidden"
    >
      {/* Mouse-following glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: glowBackground }}
      />

      {/* Title with Typewriter Effect */}
      <motion.h1
        className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight mb-6 relative"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #c7d2fe 50%, #818cf8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {displayedText}
        <span
          className={`inline-block w-1 sm:w-1.5 md:w-2 h-10 sm:h-16 md:h-20 ml-2 sm:ml-4 align-middle ${
            isTypingDone ? "animate-pulse" : ""
          }`}
          style={{
            background: "linear-gradient(180deg, #818cf8, #6366f1)",
            borderRadius: "2px",
          }}
        />
      </motion.h1>

      {/* Subtitle badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: isTypingDone ? 1 : 0,
          scale: isTypingDone ? 1 : 0.9,
        }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <span
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase"
          style={{
            background: "rgba(99, 102, 241, 0.1)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
            color: "#a5b4fc",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "#818cf8" }}
          />
          AI-Powered Campus Platform
        </span>
      </motion.div>

      {/* Description & Buttons - Fade in after typing is done */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isTypingDone ? 1 : 0, y: isTypingDone ? 0 : 20 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        className="max-w-2xl mx-auto space-y-10"
      >
        <p className="text-lg sm:text-xl md:text-2xl font-light leading-relaxed tracking-wide"
          style={{ color: "rgba(148, 163, 184, 0.9)" }}
        >
          An intelligent platform designed for discovering campus events,
          accessing real-time AI assistance, and managing registrations
          effortlessly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4">
          <Link
            href="/signup"
            className="group relative w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-sm flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#ffffff",
              boxShadow: "0 0 30px rgba(99, 102, 241, 0.3), 0 4px 15px rgba(0, 0, 0, 0.3)",
            }}
          >
            <span className="relative z-10">Get Started</span>
            <svg
              className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "linear-gradient(135deg, #818cf8, #a78bfa)",
              }}
            />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-full font-medium text-sm flex items-center justify-center transition-all duration-300 hover:scale-105"
            style={{
              background: "transparent",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              color: "#c7d2fe",
              boxShadow: "0 0 15px rgba(99, 102, 241, 0.05)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.6)";
              e.currentTarget.style.background = "rgba(99, 102, 241, 0.08)";
              e.currentTarget.style.boxShadow = "0 0 25px rgba(99, 102, 241, 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.3)";
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.boxShadow = "0 0 15px rgba(99, 102, 241, 0.05)";
            }}
          >
            Log In
          </Link>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isTypingDone ? 0.5 : 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div
          className="w-6 h-10 rounded-full flex items-start justify-center pt-2"
          style={{ border: "1px solid rgba(99, 102, 241, 0.3)" }}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1 rounded-full"
            style={{ background: "#818cf8" }}
          />
        </div>
      </motion.div>
    </motion.section>
  );
}
