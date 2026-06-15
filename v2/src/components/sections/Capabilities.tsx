"use client";

import { Database, Zap, Link, BrainCircuit, type LucideIcon } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { Tag } from "@/components/shared/Tag";
import { capabilities } from "@/lib/data";
import { useState, useRef, useCallback } from "react";

const iconMap: Record<string, LucideIcon> = {
  Database,
  Zap,
  Link,
  BrainCircuit,
};

function CapabilityCard({ cap, index, Icon }: {
  cap: typeof capabilities[number];
  index: number;
  Icon: LucideIcon | undefined;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlight({ x, y, active: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setSpotlight((s) => ({ ...s, active: false }));
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-[10px] p-5 overflow-hidden cursor-default"
      style={{
        background: spotlight.active
          ? `radial-gradient(180px circle at ${spotlight.x}% ${spotlight.y}%, rgba(0,113,227,0.04) 0%, #ffffff 72%)`
          : "#ffffff",
        border: spotlight.active
          ? "1px solid rgba(0,113,227,0.22)"
          : "1px solid rgba(0,0,0,0.06)",
        boxShadow: spotlight.active
          ? "0 18px 48px rgba(0,0,0,0.08)"
          : "0 1px 2px rgba(0,0,0,0.03)",
        transition: "border-color 0.2s, box-shadow 0.2s",
        transitionDelay: `${index * 60}ms`,
      }}
    >
      {/* Shine streak following cursor */}
      {spotlight.active && (
        <div
          className="absolute pointer-events-none"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            left: `calc(${spotlight.x}% - 60px)`,
            top: `calc(${spotlight.y}% - 60px)`,
            background: "radial-gradient(circle, rgba(0,113,227,0.06) 0%, transparent 70%)",
            transition: "left 0.05s linear, top 0.05s linear",
          }}
        />
      )}

      {/* Top-edge accent on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: spotlight.active
            ? "linear-gradient(90deg, transparent, rgba(41,151,255,0.5), transparent)"
            : "transparent",
          boxShadow: "none",
          transition: "background 0.2s, box-shadow 0.2s",
        }}
      />

      {/* Icon box */}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
        style={{
          background: spotlight.active ? "rgba(0,113,227,0.08)" : "#f5f5f7",
          border: spotlight.active ? "1px solid rgba(0,113,227,0.18)" : "1px solid rgba(0,0,0,0.06)",
          boxShadow: "none",
          transition: "all 0.2s",
        }}
      >
        {Icon && (
          <Icon
            size={16}
            style={{
              color: spotlight.active ? "#0071e3" : "rgba(0,113,227,0.8)",
              filter: "none",
              transition: "all 0.2s",
            }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Name */}
      <h3
        className="font-semibold mb-2"
        style={{
          fontSize: "19px",
          color: "#1d1d1f",
          textShadow: "none",
          transition: "all 0.2s",
        }}
      >
        {cap.name}
      </h3>

      {/* Description */}
      <p className="apple-text mb-4" style={{ fontSize: "13px" }}>
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
}

export function Capabilities() {
  const [ref, visible] = useInView<HTMLElement>();

  return (
    <section
        ref={ref}
        id="expertise"
        className="bg-[#eef5ff] py-24 transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
        }}
      >
        <div className="max-w-content mx-auto">
          <h2
            className="font-semibold text-[#1d1d1f] mb-12"
            style={{ fontSize: "clamp(36px, 5vw, 64px)", letterSpacing: "-0.04em", lineHeight: 1.05 }}
          >
            What I build.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {capabilities.map((cap, i) => {
              const Icon = iconMap[cap.icon];
              return (
                <CapabilityCard key={cap.name} cap={cap} index={i} Icon={Icon} />
              );
            })}
          </div>
        </div>
      </section>
  );
}
