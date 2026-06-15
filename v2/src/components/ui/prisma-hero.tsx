"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef, type CSSProperties } from "react";

interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: CSSProperties;
}

export const WordsPullUp = ({
  text,
  className = "",
  showAsterisk = false,
  style,
}: WordsPullUpProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;

        return (
          <motion.span
            key={`${word}-${i}`}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="relative inline-block"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

interface Segment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: Segment[];
  className?: string;
  style?: CSSProperties;
}

export const WordsPullUpMultiStyle = ({
  segments,
  className = "",
  style,
}: WordsPullUpMultiStyleProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const words: { word: string; className?: string }[] = [];
  segments.forEach((segment) => {
    segment.text.split(" ").forEach((word) => {
      if (word) words.push({ word, className: segment.className });
    });
  });

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`} style={style}>
      {words.map((word, i) => (
        <motion.span
          key={`${word.word}-${i}`}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className={`inline-block ${word.className ?? ""}`}
          style={{ marginRight: "0.25em" }}
        >
          {word.word}
        </motion.span>
      ))}
    </div>
  );
};

const navItems = [
  { label: "Work", href: "#work" },
  { label: "Expertise", href: "#expertise" },
  { label: "Model", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const metrics = [
  { value: "-30%", label: "Response time" },
  { value: "-20%", label: "Manual errors" },
  { value: "6+", label: "Years" },
];

const PrismaHero = () => {
  return (
    <section id="hero" className="min-h-screen w-full bg-black p-2 sm:p-3">
      <div className="relative min-h-[calc(100vh-1rem)] w-full overflow-hidden rounded-2xl md:rounded-[2rem]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
        />

        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.68] mix-blend-overlay" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(10,132,255,0.22),transparent_28%),linear-gradient(to_bottom,rgba(0,0,0,0.42),rgba(0,0,0,0.1)_46%,rgba(0,0,0,0.78))]" />

        <nav className="fixed left-1/2 top-0 z-50 -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-b-2xl bg-black px-4 py-2 sm:gap-6 md:gap-10 md:rounded-b-3xl md:px-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="whitespace-nowrap text-[12px] font-medium transition-colors md:text-sm"
                style={{ color: "rgba(225, 224, 204, 0.78)" }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="absolute left-0 right-0 top-20 z-10 px-4 sm:px-6 md:px-10">
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-[13px] font-medium text-white/86 backdrop-blur"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]" />
            Senior Data Services Consultant
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-4 sm:px-6 md:px-10">
          <div className="grid grid-cols-12 items-end gap-4">
            <div className="col-span-12 lg:col-span-8">
              <p className="mb-4 text-[14px] font-medium text-white/65">
                Reda Essabre · Paris / Remote
              </p>
              <h1
                className="font-semibold leading-[0.9] text-[19vw] tracking-[-0.055em] sm:text-[16vw] md:text-[14vw] lg:text-[10vw] xl:text-[9vw]"
                style={{ color: "#f5f5f7" }}
              >
                <WordsPullUp text="Data services" />
              </h1>
            </div>

            <div className="col-span-12 flex flex-col gap-5 pb-4 lg:col-span-4 lg:pb-10">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-[34rem] text-[17px] text-white/82 sm:text-[19px]"
                style={{ lineHeight: 1.42 }}
              >
                I design, automate, and stabilize the data services behind business operations:
                SQL reporting, integrations, workflow automation, and AI-ready data pipelines.
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-3 gap-2"
              >
                {metrics.map((metric) => (
                  <div key={metric.label} className="border-t border-white/25 pt-3">
                    <div className="text-2xl font-semibold leading-none text-white sm:text-3xl">
                      {metric.value}
                    </div>
                    <div className="mt-1 text-[12px] text-white/58">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.a
                href="#contact"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group inline-flex items-center gap-2 self-start rounded-full bg-white py-1 pl-5 pr-1 text-[15px] font-medium text-[#1d1d1f] transition-all hover:gap-3 sm:text-[17px]"
              >
                Book a consultation
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                  <ArrowRight className="h-4 w-4" style={{ color: "#ffffff" }} />
                </span>
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { PrismaHero };
