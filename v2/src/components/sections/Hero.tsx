"use client";

import { useState } from "react";
import AnimatedGradient from "@/components/ui/animated-gradient";
import { heroGradientConfig, heroNoiseConfig } from "@/lib/gradient-configs";
import { heroData } from "@/lib/data";

function EyebrowBar({ eyebrow }: { eyebrow: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: hovered ? "1px solid rgba(0,113,227,0.4)" : "1px solid rgba(255,255,255,0.08)",
        background: hovered ? "rgba(0,113,227,0.06)" : "rgba(255,255,255,0.03)",
        boxShadow: hovered ? "0 0 20px rgba(0,113,227,0.15), inset 0 0 10px rgba(0,113,227,0.04)" : "none",
        transition: "all 0.25s ease",
      }}
    >
      <span
        className="w-[7px] h-[7px] rounded-full shrink-0"
        style={{
          background: "var(--green-avail)",
          boxShadow: hovered
            ? "0 0 12px rgba(74,222,128,0.8)"
            : "0 0 8px rgba(74,222,128,0.5)",
          animation: "pulse-dot 2s infinite",
          transition: "box-shadow 0.25s",
        }}
        aria-hidden="true"
      />
      <span
        className="font-barlow-sc font-bold uppercase"
        style={{
          fontSize: "11px",
          letterSpacing: "0.16em",
          color: hovered ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)",
          textShadow: hovered ? "0 0 16px rgba(0,113,227,0.5)" : "none",
          transition: "all 0.25s ease",
        }}
      >
        {eyebrow}
      </span>
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* WebGL animated background */}
      <AnimatedGradient config={heroGradientConfig} noise={heroNoiseConfig} />

      {/* LED floor glow */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        aria-hidden="true"
      >
        {/* Upward radial bleed */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40"
          style={{
            background:
              "linear-gradient(to top, rgba(0,113,227,0.1) 0%, rgba(0,113,227,0.03) 40%, transparent 100%)",
          }}
        />
        {/* 1px LED strip */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[55%] h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(0,113,227,0.6), transparent)",
            boxShadow:
              "0 0 20px 4px rgba(0,113,227,0.25), 0 0 60px 12px rgba(0,113,227,0.1)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-content mx-auto px-6 sm:px-10 lg:px-20 pt-32 pb-28">

        {/* Eyebrow */}
        <EyebrowBar eyebrow={heroData.eyebrow} />

        {/* Headline */}
        <h1
          className="font-barlow-sc font-black uppercase leading-none tracking-tight mb-5"
          style={{ fontSize: "clamp(44px, 6.5vw, 72px)", letterSpacing: "-0.02em" }}
        >
          <span className="block text-white">{heroData.headlineParts.before}</span>
          <span className="block" style={{ color: "#0071e3" }}>
            {heroData.headlineParts.accent}
          </span>
          <span className="block text-white">{heroData.headlineParts.after}</span>
        </h1>

        {/* Subtext */}
        <p
          className="max-w-[560px] mb-10"
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
            fontSize: "19px",
            fontWeight: 300,
            lineHeight: 1.65,
            letterSpacing: "0.01em",
            color: "rgba(255,255,255,0.88)",
            textShadow: "0 0 30px rgba(0,113,227,0.25), 0 0 60px rgba(0,113,227,0.1)",
          }}
        >
          {heroData.subtext}
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-4 flex-wrap mb-14">
          <a
            href="#contact"
            className="font-barlow font-semibold text-white px-7 py-3 rounded-[5px] transition-transform duration-200 hover:scale-[1.02]"
            style={{
              background: "#0071e3",
              fontSize: "15px",
              boxShadow:
                "0 4px 24px rgba(0,113,227,0.5), 0 0 40px rgba(0,113,227,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            Let&apos;s Talk →
          </a>
          <a
            href="#work"
            className="font-barlow font-medium text-white/70 px-7 py-3 rounded-[5px] border transition-colors duration-200 hover:text-white"
            style={{
              fontSize: "15px",
              background: "rgba(255,255,255,0.06)",
              borderColor: "rgba(255,255,255,0.12)",
            }}
          >
            See Work
          </a>
        </div>

        {/* Metrics strip */}
        <div
          className="flex gap-0 flex-wrap"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "24px" }}
        >
          {heroData.metrics.map((m, i) => (
            <div
              key={m.label}
              className="pr-8 mr-8"
              style={{
                borderRight: i < heroData.metrics.length - 1
                  ? "1px solid rgba(255,255,255,0.07)"
                  : undefined,
              }}
            >
              <div
                className="font-barlow-sc font-black text-white leading-none mb-1"
                style={{ fontSize: "clamp(22px, 2.5vw, 28px)" }}
              >
                {m.value}
              </div>
              <div className="font-barlow font-medium text-[10px] uppercase tracking-[0.1em] text-white/20">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30"
        aria-hidden="true"
      >
        <div
          className="w-px h-8 bg-white/30"
          style={{ animation: "scroll-pulse 2s ease-in-out infinite" }}
        />
      </div>
    </section>
  );
}
