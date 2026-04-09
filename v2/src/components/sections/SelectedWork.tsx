"use client";

import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { Tag } from "@/components/shared/Tag";
import { LedDivider } from "@/components/shared/LedDivider";
import { caseStudies, type CaseStudy } from "@/lib/data";

function CaseCard({ c, delay = 0 }: { c: CaseStudy; delay?: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-[10px] overflow-hidden transition-all duration-200 cursor-pointer"
      style={{
        background: hovered ? "rgba(229,9,20,0.04)" : "var(--surface)",
        border: hovered ? "1px solid rgba(229,9,20,0.5)" : "1px solid rgba(255,255,255,0.07)",
        boxShadow: hovered
          ? "0 0 0 1px rgba(229,9,20,0.2), 0 0 16px rgba(229,9,20,0.12), inset 0 0 20px rgba(229,9,20,0.04)"
          : undefined,
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Top-edge LED strip on hover */}
      {hovered && (
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(229,9,20,0.8), transparent)",
            boxShadow: "0 0 8px 1px rgba(229,9,20,0.4)",
          }}
          aria-hidden="true"
        />
      )}

      <div className="p-6">
        {/* Header row */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-white/20 block mb-1">
              {c.id}
            </span>
            <span className="font-mono text-[9px] tracking-[0.1em] text-white/15">
              {c.category}
            </span>
          </div>
          <span
            className="font-barlow-sc font-black leading-none"
            style={{
              fontSize: c.featured ? "clamp(20px, 2.5vw, 28px)" : "22px",
              color: hovered ? "#E50914" : "#ffffff",
              textShadow: hovered ? "0 0 16px rgba(229,9,20,0.5)" : undefined,
              transition: "color 0.2s, text-shadow 0.2s",
            }}
          >
            {c.outcome}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-barlow-sc font-bold text-white leading-snug mb-2" style={{ fontSize: "15px" }}>
          {c.title}
        </h3>

        {/* Description */}
        <p className="font-barlow font-light text-white/35 leading-relaxed mb-4" style={{ fontSize: "12px" }}>
          {c.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-[5px]">
          {c.tags.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
      </div>
    </article>
  );
}

export function SelectedWork() {
  const [ref, visible] = useInView<HTMLElement>();
  const featured = caseStudies.find((c) => c.featured)!;
  const rest = caseStudies.filter((c) => !c.featured);

  return (
    <>
      <LedDivider />
      <section
        ref={ref}
        id="work"
        className="py-24 transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
        }}
      >
        <div className="max-w-content mx-auto px-6 sm:px-10 lg:px-20">
          <SectionLabel number="03" text="Selected Work" />
          <h2
            className="font-barlow-sc font-black uppercase text-white mb-12 tracking-tight"
            style={{ fontSize: "clamp(28px, 4vw, 42px)", letterSpacing: "-0.02em" }}
          >
            SELECTED WORK
          </h2>

          {/* Featured card */}
          <div className="mb-6">
            <CaseCard c={featured} />
          </div>

          {/* 2×2 grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {rest.map((c, i) => (
              <CaseCard key={c.id} c={c} delay={i * 80} />
            ))}
          </div>

          {/* Footer note */}
          <div
            className="rounded-xl p-6 text-center"
            style={{ border: "1px dashed rgba(255,255,255,0.1)" }}
          >
            <p className="font-mono text-[11px] text-white/20 mb-4 leading-relaxed">
              More case studies available on request. NDA-protected work discussed privately.
            </p>
            <a
              href="#contact"
              className="font-barlow font-medium text-[13px] text-white/50 hover:text-white border border-white/10 px-5 py-2 rounded-[5px] transition-colors duration-200"
            >
              Discuss a project →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
