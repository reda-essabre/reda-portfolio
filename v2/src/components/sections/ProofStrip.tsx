"use client";

import { useInView } from "@/hooks/useInView";
import { proofMetrics, award } from "@/lib/data";

export function ProofStrip() {
  const [ref, visible] = useInView<HTMLElement>();

  return (
    <section
      ref={ref}
      id="proof"
      className="py-20 transition-all duration-700"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
      }}
    >
      <div className="max-w-content mx-auto px-6 sm:px-10 lg:px-20">

        {/* Metrics grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.07] rounded-xl overflow-hidden mb-8">
          {proofMetrics.map((m) => (
            <div
              key={m.label}
              className="relative px-6 py-8 text-center"
              style={{ background: "var(--surface)" }}
            >
              {/* LED underline per cell */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-px"
                style={{
                  background: "rgba(229,9,20,0.45)",
                  boxShadow: "0 0 8px 2px rgba(229,9,20,0.2)",
                }}
                aria-hidden="true"
              />
              <div
                className="font-barlow-sc font-black text-white leading-none mb-2"
                style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
              >
                {m.value}
              </div>
              <div className="font-barlow font-semibold text-[10px] uppercase tracking-[0.12em] text-white/30 mb-2">
                {m.label}
              </div>
              <div className="font-barlow font-light text-[11px] text-white/20 leading-relaxed hidden sm:block">
                {m.detail}
              </div>
            </div>
          ))}
        </div>

        {/* Award callout */}
        <div
          className="rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start"
          style={{
            background: "rgba(229,9,20,0.04)",
            border: "1px solid rgba(229,9,20,0.15)",
          }}
        >
          <div className="shrink-0">
            <div
              className="font-barlow-sc font-black text-[11px] tracking-[0.15em] uppercase mb-1"
              style={{ color: "#E50914", textShadow: "0 0 12px rgba(229,9,20,0.4)" }}
            >
              {award.label}
            </div>
            <div className="font-mono text-[10px] text-white/20 tracking-[0.1em] uppercase">
              {award.org}
            </div>
          </div>
          <blockquote className="font-barlow font-light text-sm text-white/40 italic leading-relaxed border-l border-white/10 pl-6">
            &ldquo;{award.quote}&rdquo;
          </blockquote>
        </div>
      </div>
    </section>
  );
}
