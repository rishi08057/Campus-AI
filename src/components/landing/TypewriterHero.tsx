"use client";

import React, { useState, useEffect } from "react";

interface TypewriterHeroProps {
  onExploreClick?: () => void;
}

export function TypewriterHero({ onExploreClick }: TypewriterHeroProps) {
  const fullText = "Campus-AI";
  const [displayedText, setDisplayedText] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        setIsDone(true);
        clearInterval(timer);
      }
    }, 140);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="min-h-[70vh] flex flex-col justify-center items-center text-center px-4 bg-black select-none">
      <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white font-sans">
        {displayedText}
        <span className="inline-block w-1.5 sm:w-2 h-10 sm:h-16 ml-2 bg-white animate-pulse align-middle" />
      </h1>

      {isDone && (
        <button
          onClick={onExploreClick}
          className="mt-10 text-xs tracking-widest text-neutral-400 hover:text-white uppercase font-medium transition cursor-pointer"
        >
          Scroll to explore ↓
        </button>
      )}
    </section>
  );
}
