"use client";

import AnimatedGradient from "@/components/ui/animated-gradient";
import { heroGradientConfig, heroNoiseConfig } from "@/lib/gradient-configs";
import { contact } from "@/lib/data";
import { LedDivider } from "@/components/shared/LedDivider";

export function FinalCTA() {
  return (
    <>
      <LedDivider />
      <section
        id="contact"
        className="relative overflow-hidden py-32 text-center"
        style={{ background: "var(--black)" }}
      >
        {/* WebGL background */}
        <AnimatedGradient config={heroGradientConfig} noise={heroNoiseConfig} />

        {/* LED floor spotlight */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute bottom-0 left-0 right-0 h-48"
            style={{
              background:
                "radial-gradient(ellipse at bottom, rgba(229,9,20,0.1) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(229,9,20,0.7), transparent)",
              boxShadow:
                "0 0 30px 6px rgba(229,9,20,0.2), 0 0 80px 20px rgba(229,9,20,0.08)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl mx-auto px-6 sm:px-10">
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/20 mb-5">
            // Open for new engagements
          </div>

          <h2
            className="font-barlow-sc font-black uppercase text-white leading-none mb-5 tracking-tight"
            style={{ fontSize: "clamp(32px, 5vw, 52px)", letterSpacing: "-0.02em" }}
          >
            HAVE A SYSTEM<br />TO BUILD?
          </h2>

          <p className="font-barlow font-light text-white/40 mb-10 leading-relaxed" style={{ fontSize: "15px" }}>
            Available for consulting engagements, contracts, and remote work.
            Response within 24 hours.
          </p>

          {/* Primary CTA */}
          <div className="mb-10">
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex font-barlow font-semibold text-white px-10 py-4 rounded-[6px] transition-transform duration-200 hover:scale-[1.02]"
              style={{
                background: "#E50914",
                fontSize: "16px",
                boxShadow:
                  "0 0 24px rgba(229,9,20,0.5), 0 0 60px rgba(229,9,20,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              Let&apos;s Talk →
            </a>
          </div>

          {/* Secondary links */}
          <div className="flex justify-center gap-6 flex-wrap">
            <a
              href={`mailto:${contact.email}`}
              className="font-mono text-[11px] tracking-[0.1em] text-white/30 hover:text-white/60 transition-colors duration-150"
            >
              {contact.email}
            </a>
            <span className="text-white/15">·</span>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] tracking-[0.1em] text-white/30 hover:text-white/60 transition-colors duration-150"
            >
              LinkedIn ↗
            </a>
            <span className="text-white/15">·</span>
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] tracking-[0.1em] text-white/30 hover:text-white/60 transition-colors duration-150"
            >
              GitHub ↗
            </a>
          </div>

          {/* Availability badge */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <span
              className="w-[6px] h-[6px] rounded-full"
              style={{
                background: "var(--green-avail)",
                boxShadow: "0 0 8px rgba(74,222,128,0.5)",
                animation: "pulse-dot 2s infinite",
              }}
              aria-hidden="true"
            />
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/20">
              Open to new engagements · Consulting · Contract · Remote
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
