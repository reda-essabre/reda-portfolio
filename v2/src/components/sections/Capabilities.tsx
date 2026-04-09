"use client";

import { Database, Zap, Link, BrainCircuit, type LucideIcon } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { Tag } from "@/components/shared/Tag";
import { LedDivider } from "@/components/shared/LedDivider";
import { capabilities } from "@/lib/data";

const iconMap: Record<string, LucideIcon> = {
  Database,
  Zap,
  Link,
  BrainCircuit,
};

export function Capabilities() {
  const [ref, visible] = useInView<HTMLElement>();

  return (
    <>
      <LedDivider />
      <section
        ref={ref}
        id="expertise"
        className="py-24 transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
        }}
      >
        <div className="max-w-content mx-auto px-6 sm:px-10 lg:px-20">
          <SectionLabel number="04" text="What I Build" />
          <h2
            className="font-barlow-sc font-black uppercase text-white mb-12 tracking-tight"
            style={{ fontSize: "clamp(28px, 4vw, 42px)", letterSpacing: "-0.02em" }}
          >
            WHAT I BUILD
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {capabilities.map((cap, i) => {
              const Icon = iconMap[cap.icon];
              return (
                <div
                  key={cap.name}
                  className="rounded-[10px] p-5 transition-colors duration-200"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    transitionDelay: `${i * 60}ms`,
                  }}
                >
                  {/* Icon box */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
                    style={{
                      background: "rgba(229,9,20,0.1)",
                      border: "1px solid rgba(229,9,20,0.2)",
                    }}
                  >
                    {Icon && (
                      <Icon
                        size={15}
                        style={{ color: "rgba(229,9,20,0.8)" }}
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="font-barlow-sc font-bold text-white mb-2" style={{ fontSize: "14px" }}>
                    {cap.name}
                  </h3>

                  {/* Description */}
                  <p className="font-barlow font-light text-white/35 mb-4 leading-relaxed" style={{ fontSize: "12px" }}>
                    {cap.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-[5px]">
                    {cap.tags.map((t) => (
                      <Tag key={t} label={t} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
