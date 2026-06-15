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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-5">
          <div>
            <span className="block text-[12px] text-[#86868b]">
              {c.category}
            </span>
            <span className="mt-1 block text-[12px] text-[#6e6e73]">
              {c.period}
            </span>
          </div>
          <span
            className="w-fit rounded-full px-3 py-1 text-sm font-semibold leading-none"
            style={{
              color: hovered ? "#e1e0cc" : "#1d1d1f",
              background: hovered ? "#1d1d1f" : "#f5f5f7",
              border: "1px solid rgba(0,0,0,0.06)",
              textShadow: "none",
              transition: "all 0.2s",
            }}
          >
            {c.outcome}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-[#1d1d1f] leading-snug mb-2" style={{ fontSize: "20px", letterSpacing: "-0.01em" }}>
          {c.title}
        </h3>

        <p className="apple-text mb-4" style={{ fontSize: c.featured ? "15px" : "14px" }}>
          {c.description}
        </p>

        <div
          className="mb-5 rounded-[8px] p-4"
          style={{
            background: hovered ? "rgba(225,224,204,0.22)" : "#f5f5f7",
            border: "1px solid rgba(0,0,0,0.06)",
            transition: "background 0.2s",
          }}
        >
          <div className="mb-1 text-[12px] font-medium text-[#86868b]">
            Impact
          </div>
          <p className="text-[14px] leading-relaxed text-[#1d1d1f]">
            {c.impact}
          </p>
        </div>

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
            className="font-semibold text-[#1d1d1f] mb-4"
            style={{ fontSize: "clamp(36px, 5vw, 64px)", letterSpacing: "-0.04em", lineHeight: 1.05 }}
          >
            Consulting impact.
          </h2>
          <div
            className="mb-12 rounded-[14px] p-7 sm:p-9"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            }}
          >
            <p
              className="max-w-4xl font-semibold text-[#1d1d1f]"
              style={{ fontSize: "clamp(24px, 3vw, 40px)", letterSpacing: "-0.04em", lineHeight: 1.08 }}
            >
              Growth gets expensive when operations depend on manual effort.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <p className="apple-text mb-4" style={{ fontSize: "16px" }}>
                  The same patterns appear again and again:
                </p>
                <div className="grid gap-3">
                  {[
                    "fragmented workflows",
                    "unreliable reporting",
                    "disconnected data",
                    "processes held together by people instead of systems",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[#1d1d1f]" />
                      <span className="text-[15px] leading-relaxed text-[#1d1d1f]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="apple-text mb-5" style={{ fontSize: "16px" }}>
                  That is the layer I work on. I design automation and operational
                  data systems that bring clarity, reliability, and scale to the way
                  a business runs.
                </p>
                <div className="mb-5 flex flex-wrap gap-[6px]">
                  {["n8n", "data engineering", "reporting architecture", "workflow design", "CI/CD"].map((tag) => (
                    <Tag key={tag} label={tag} />
                  ))}
                </div>
                <p className="text-[15px] leading-relaxed text-[#1d1d1f]">
                  The goal is simple: replace friction with structure.
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {[
                "faster execution",
                "cleaner operational flow",
                "more reliable reporting",
                "less manual intervention",
                "stronger control as the business grows",
              ].map((result) => (
                <div
                  key={result}
                  className="rounded-[10px] p-4"
                  style={{ background: "#f5f5f7", border: "1px solid rgba(0,0,0,0.06)" }}
                >
                  <div className="mb-3 text-[18px] text-[#1d1d1f]">✦</div>
                  <div className="text-[14px] leading-snug text-[#1d1d1f]">
                    {result}
                  </div>
                </div>
              ))}
            </div>
          </div>

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
