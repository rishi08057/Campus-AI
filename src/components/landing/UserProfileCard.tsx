"use client";

import React, { useState, useEffect } from "react";
import { Edit2, Check } from "lucide-react";

export function UserProfileCard() {
  const [username, setUsername] = useState<string>("Username");
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("Username");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("campus_ai_username");
      if (saved) {
        setUsername(saved);
        setTempName(saved);
      }
    }
  }, []);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUsername(tempName.trim());
      if (typeof window !== "undefined") {
        localStorage.setItem("campus_ai_username", tempName.trim());
      }
    }
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 text-center">
      <div className="inline-flex items-center justify-center gap-3">
        <div className="h-12 w-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-base font-semibold text-white">
          {username.slice(0, 2).toUpperCase()}
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                className="px-3 py-1 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-bold text-2xl focus:outline-none"
                autoFocus
              />
              <button
                onClick={handleSaveName}
                className="p-1.5 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200 transition cursor-pointer"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              className="flex items-center gap-2 group cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Welcome back, {username}
              </h2>
              <Edit2 className="w-4 h-4 text-neutral-500 group-hover:text-white transition" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
