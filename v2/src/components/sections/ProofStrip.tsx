"use client";

import { useInView } from "@/hooks/useInView";
import { proofMetrics, award } from "@/lib/data";
import {
  HoverSlider,
  TextStaggerHover,
  useHoverSliderContext,
} from "@/components/ui/animated-slideshow";

function ProofMetricCard({
  metric,
  index,
}: {
  metric: (typeof proofMetrics)[number];
  index: number;
}) {
  const { activeSlide, changeSlide } = useHoverSliderContext();
  const active = activeSlide === index;

  return (
    <div
      onMouseEnter={() => changeSlide(index)}
      className="relative rounded-[18px] px-6 py-8 text-center transition-all duration-300"
      style={{
        background: active
          ? "linear-gradient(135deg, #20201d, #343326 58%, #171715)"
          : "#f5f5f7",
        border: active ? "1px solid rgba(225,224,204,0.28)" : "1px solid rgba(0,0,0,0.06)",
        boxShadow: active ? "0 18px 48px rgba(29,29,31,0.22)" : "none",
        transform: active ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      <div
        className="absolute bottom-0 left-1/2 h-px w-10 -translate-x-1/2"
        style={{
          background: active ? "rgba(225,224,204,0.9)" : "rgba(29,29,31,0.16)",
        }}
        aria-hidden="true"
      />
      <div
        className="mb-2 font-semibold leading-none"
        style={{
          fontSize: "clamp(32px, 4vw, 48px)",
          color: active ? "#ffffff" : "#1d1d1f",
          letterSpacing: "-0.02em",
        }}
      >
        <TextStaggerHover text={metric.value} index={index} />
      </div>
      <div
        className="mb-2 text-[14px] font-medium"
        style={{ color: active ? "#fff8d8" : "#1d1d1f" }}
      >
        <TextStaggerHover text={metric.label} index={index} />
      </div>
      <div
        className="hidden sm:block"
        style={{
          color: active ? "rgba(255,255,255,0.88)" : "#6e6e73",
          fontSize: "13px",
          lineHeight: 1.62,
          fontWeight: active ? 450 : 400,
        }}
      >
        {metric.detail}
      </div>
    </div>
  );
}

export function ProofStrip() {
  const [ref, visible] = useInView<HTMLElement>();

  return (
    <section
      ref={ref}
      id="proof"
      className="bg-white py-20 transition-all duration-700"
      style={{
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
      }}
    >
      <div className="max-w-content mx-auto px-6 sm:px-10 lg:px-20">

        {/* Metrics grid */}
        <HoverSlider className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {proofMetrics.map((metric, index) => (
            <ProofMetricCard key={metric.label} metric={metric} index={index} />
          ))}
        </HoverSlider>

        {/* Award callout */}
        <div
          className="rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start"
          style={{
            background: "#f5f5f7",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div className="shrink-0">
            <div
              className="font-semibold text-[14px] mb-1"
              style={{ color: "#1d1d1f", textShadow: "none" }}
            >
              {award.label}
            </div>
            <div className="text-[13px] text-[#86868b]">
              {award.org}
            </div>
          </div>
          <blockquote className="apple-text border-l border-black/10 pl-6" style={{ fontSize: "15px" }}>
            &ldquo;{award.quote}&rdquo;
          </blockquote>
        </div>
      </div>
    </section>
  );
}
