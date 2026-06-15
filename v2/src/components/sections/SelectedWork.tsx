"use client";

import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import { Tag } from "@/components/shared/Tag";
import ButtonWithIconDemo from "@/components/ui/button-witn-icon";
import { caseStudies, type CaseStudy } from "@/lib/data";

function CaseCard({ c, delay = 0 }: { c: CaseStudy; delay?: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-[10px] overflow-hidden transition-all duration-200 cursor-pointer"
      style={{
        background: "#ffffff",
        border: hovered ? "1px solid rgba(0,113,227,0.22)" : "1px solid rgba(0,0,0,0.06)",
        boxShadow: hovered
          ? "0 18px 48px rgba(0,0,0,0.08)"
          : "0 1px 2px rgba(0,0,0,0.03)",
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Top-edge accent on hover */}
      {hovered && (
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(41,151,255,0.55), transparent)",
            boxShadow: "none",
          }}
          aria-hidden="true"
        />
      )}

      <div className="p-7">
        {/* Header row */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[12px] text-[#86868b]">
              {c.category}
            </span>
          </div>
          <span
            className="font-semibold leading-none"
            style={{
              fontSize: c.featured ? "clamp(20px, 2.5vw, 28px)" : "22px",
              color: hovered ? "#0071e3" : "#1d1d1f",
              textShadow: "none",
              transition: "color 0.2s",
            }}
          >
            {c.outcome}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-[#1d1d1f] leading-snug mb-2" style={{ fontSize: "20px", letterSpacing: "-0.01em" }}>
          {c.title}
        </h3>

        {/* Description */}
        <p className="apple-text mb-4" style={{ fontSize: "13px" }}>
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
    <section
        ref={ref}
        id="work"
        className="bg-[#f5f5f7] py-24 transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
        }}
      >
        <div className="max-w-content mx-auto px-6 sm:px-10 lg:px-20">
          <h2
            className="font-semibold text-[#1d1d1f] mb-12"
            style={{ fontSize: "clamp(36px, 5vw, 64px)", letterSpacing: "-0.04em", lineHeight: 1.05 }}
          >
            Selected work.
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

          <div className="flex justify-center">
            <ButtonWithIconDemo href="#contact">
              Discuss a project
            </ButtonWithIconDemo>
          </div>
        </div>
      </section>
  );
}
