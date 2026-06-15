"use client";

import { useInView } from "@/hooks/useInView";
import { Tag } from "@/components/shared/Tag";
import { operatingModel, award } from "@/lib/data";

export function OperatingModel() {
  const [ref, visible] = useInView<HTMLElement>();

  return (
    <section
        ref={ref}
        id="about"
        className="bg-white py-24 transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
        }}
      >
        <div className="max-w-content mx-auto px-6 sm:px-10 lg:px-20">
          <h2
            className="font-semibold text-[#1d1d1f] mb-16"
            style={{ fontSize: "clamp(36px, 5vw, 64px)", letterSpacing: "-0.04em", lineHeight: 1.05 }}
          >
            The operating model.
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left — philosophy + process */}
            <div>
              {/* Pull quote */}
              <blockquote
                className="font-semibold text-[#1d1d1f] leading-snug mb-12"
                style={{
                  fontSize: "clamp(22px, 2.8vw, 32px)",
                  borderLeft: "3px solid #2997ff",
                  paddingLeft: "24px",
                  letterSpacing: "-0.02em",
                }}
              >
                &ldquo;{operatingModel.quote}&rdquo;
              </blockquote>

              {/* Process steps */}
              <div className="flex flex-col gap-0">
                {operatingModel.process.map((step, i) => (
                  <div key={step.step} className="flex gap-5 pb-10 relative">
                    {/* Vertical connector line */}
                    {i < operatingModel.process.length - 1 && (
                      <div
                        className="absolute left-[15px] top-8 bottom-0 w-px"
                        style={{ background: "rgba(0,0,0,0.12)" }}
                        aria-hidden="true"
                      />
                    )}

                    {/* Step dot */}
                    <div
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10"
                      style={{
                        background: "#ffffff",
                        border: "1px solid rgba(0,0,0,0.08)",
                        boxShadow: "none",
                      }}
                    >
                      <span
                        className="font-mono text-[9px] font-medium"
                        style={{ color: "#2997ff" }}
                      >
                        {step.step}
                      </span>
                    </div>

                    <div className="pt-1">
                      <div className="font-semibold text-[#1d1d1f] mb-1" style={{ fontSize: "18px" }}>
                        {step.title}
                      </div>
                      <div className="apple-text" style={{ fontSize: "14px" }}>
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
                style={{ background: "#f5f5f7", border: "1px solid rgba(0,0,0,0.06)" }}
              >
                <div className="text-[13px] text-[#86868b] mb-4">
                  Background
                </div>
                <div className="flex flex-col gap-3">
                  <div className="apple-text" style={{ fontSize: "14px" }}>
                    <span style={{ color: "#1d1d1f", fontWeight: 600 }}>{operatingModel.bio.years} years</span> as a senior data services consultant building data systems and automation for production environments.
                  </div>
                  <div className="apple-text" style={{ fontSize: "14px" }}>
                    📍 {operatingModel.bio.location}
                  </div>
                  <div className="apple-text" style={{ fontSize: "14px" }}>
                    🌐 {operatingModel.bio.languages}
                  </div>
                </div>
              </div>

              {/* Award */}
              <div
                className="rounded-xl p-6"
                style={{
                  background: "#f5f5f7",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="font-semibold text-[14px] mb-1"
                  style={{ color: "#2997ff" }}
                >
                  {award.label}
                </div>
                <div className="text-[13px] text-[#86868b] mb-4">
                  {award.org}
                </div>
                <blockquote className="apple-text border-l border-black/10 pl-4" style={{ fontSize: "14px" }}>
                  &ldquo;{award.quote}&rdquo;
                </blockquote>
              </div>

              {/* Tools */}
              <div
                className="rounded-xl p-6"
                style={{ background: "#f5f5f7", border: "1px solid rgba(0,0,0,0.06)" }}
              >
                <div className="text-[13px] text-[#86868b] mb-4">
                  Tools & stack
                </div>
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
  );
}
