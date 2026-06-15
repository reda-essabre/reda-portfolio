"use client";

import { useState } from "react";

interface TagProps {
  label: string;
}

export function Tag({ label }: TagProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden whitespace-nowrap text-[12px] px-3 py-1 rounded-full cursor-default"
      style={{
        color: hovered ? "#1d1d1f" : "#6e6e73",
        border: hovered ? "1px solid rgba(29,29,31,0.16)" : "1px solid rgba(0,0,0,0.08)",
        background: hovered
          ? "linear-gradient(135deg, #e1e0cc, #ffffff 52%, #d9d8c4)"
          : "linear-gradient(135deg, #f5f5f7, #ffffff 52%, #ececf0)",
        boxShadow: hovered
          ? "inset 0 1px 0 rgba(255,255,255,0.9), 0 6px 18px rgba(29,29,31,0.08)"
          : "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(0,0,0,0.04)",
        textShadow: "none",
        transition: "all 0.2s ease",
      }}
    >
      <span
        className="pointer-events-none absolute inset-y-0 -left-8 w-8 rotate-12 bg-white/75 blur-[1px] transition-transform duration-500"
        style={{ transform: hovered ? "translateX(92px)" : "translateX(0)" }}
        aria-hidden="true"
      />
      <span className="relative z-10">{label}</span>
    </span>
  );
}
