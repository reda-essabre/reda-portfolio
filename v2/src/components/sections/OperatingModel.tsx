"use client";

import { useInView } from "@/hooks/useInView";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { Tag } from "@/components/shared/Tag";
import { LedDivider } from "@/components/shared/LedDivider";
import { operatingModel, award } from "@/lib/data";

export function OperatingModel() {
  const [ref, visible] = useInView<HTMLElement>();

  return (
    <>
      <LedDivider />
      <section
        ref={ref}
        id="about"
        className="py-24 transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
        }}
      >
        <div className="max-w-content mx-auto px-6 sm:px-10 lg:px-20">
          <SectionLabel number="05" text="Operating Model" />
          <h2
            className="font-barlow-sc font-black uppercase text-white mb-16 tracking-tight"
            style={{ fontSize: "clamp(28px, 4vw, 42px)", letterSpacing: "-0.02em" }}
          >
            THE OPERATING MODEL
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left — philosophy + process */}
            <div>
              {/* Pull quote */}
              <blockquote
                className="font-barlow-sc font-bold text-white/70 leading-snug mb-12"
                style={{
                  fontSize: "clamp(18px, 2.2vw, 24px)",
                  borderLeft: "3px solid #E50914",
                  paddingLeft: "24px",
                }}
              >
                &ldquo;{operatingModel.quote}&rdquo;
              </blockquote>

              {/* Process steps */}
              <div className="flex flex-col gap-0">
                {operatingModel.process.map((step, i) => (
                  <div key={step.step} className="flex gap-5 pb-10 relative">
                    {/* Vertical connector line with LED dot */}
                    {i < operatingModel.process.length - 1 && (
                      <div
                        className="absolute left-[15px] top-8 bottom-0 w-px"
                        style={{ background: "rgba(229,9,20,0.15)" }}
                        aria-hidden="true"
                      />
                    )}

                    {/* Step dot */}
                    <div
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10"
                      style={{
                        background: "rgba(229,9,20,0.1)",
                        border: "1px solid rgba(229,9,20,0.3)",
                        boxShadow: "0 0 12px rgba(229,9,20,0.15)",
                      }}
                    >
                      <span
                        className="font-mono text-[9px] font-medium"
                        style={{ color: "#E50914" }}
                      >
                        {step.step}
                      </span>
                    </div>

                    <div className="pt-1">
                      <div className="font-barlow-sc font-bold text-white mb-1" style={{ fontSize: "15px" }}>
                        {step.title}
                      </div>
                      <div className="font-barlow font-light text-white/35 leading-relaxed" style={{ fontSize: "13px" }}>
                        {step.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — bio + award + tools */}
            <div className="flex flex-col gap-6">
              {/* Bio */}
              <div
                className="rounded-xl p-6"
                style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/20 mb-4">// Background</div>
                <div className="flex flex-col gap-3">
                  <div className="font-barlow font-light text-sm text-white/40">
                    <span className="text-white/60 font-medium">{operatingModel.bio.years} years</span> building data systems and automation for production environments.
                  </div>
                  <div className="font-barlow font-light text-sm text-white/40">
                    📍 {operatingModel.bio.location}
                  </div>
                  <div className="font-barlow font-light text-sm text-white/40">
                    🌐 {operatingModel.bio.languages}
                  </div>
                </div>
              </div>

              {/* Award */}
              <div
                className="rounded-xl p-6"
                style={{
                  background: "rgba(229,9,20,0.04)",
                  border: "1px solid rgba(229,9,20,0.15)",
                }}
              >
                <div
                  className="font-barlow-sc font-black text-[11px] tracking-[0.15em] uppercase mb-1"
                  style={{ color: "#E50914" }}
                >
                  {award.label}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/20 mb-4">
                  {award.org}
                </div>
                <blockquote className="font-barlow font-light text-sm text-white/35 italic leading-relaxed border-l border-white/10 pl-4">
                  &ldquo;{award.quote}&rdquo;
                </blockquote>
              </div>

              {/* Tools */}
              <div
                className="rounded-xl p-6"
                style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/20 mb-4">// Tools & Stack</div>
                <div className="flex flex-wrap gap-[6px]">
                  {operatingModel.tools.map((t) => (
                    <Tag key={t} label={t} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
