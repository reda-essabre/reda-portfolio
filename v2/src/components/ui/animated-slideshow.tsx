"use client";

import * as React from "react";
import { MotionConfig, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextStaggerHoverProps {
  text: string;
  index: number;
}

interface HoverSliderProps {
  defaultSlide?: number;
}

interface HoverSliderContextValue {
  activeSlide: number;
  changeSlide: (index: number) => void;
}

function splitText(text: string) {
  const words = text.split(" ").map((word) => word.concat(" "));
  const characters = words.map((word) => word.split("")).flat(1);

  return {
    words,
    characters,
  };
}

const HoverSliderContext = React.createContext<HoverSliderContextValue | undefined>(
  undefined
);

export function useHoverSliderContext() {
  const context = React.useContext(HoverSliderContext);
  if (context === undefined) {
    throw new Error("useHoverSliderContext must be used within a HoverSlider");
  }
  return context;
}

export const HoverSlider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & HoverSliderProps
>(({ children, className, defaultSlide = -1, ...props }, ref) => {
  const [activeSlide, setActiveSlide] = React.useState<number>(defaultSlide);
  const changeSlide = React.useCallback((index: number) => setActiveSlide(index), []);

  return (
    <HoverSliderContext.Provider value={{ activeSlide, changeSlide }}>
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    </HoverSliderContext.Provider>
  );
});
HoverSlider.displayName = "HoverSlider";

export const TextStaggerHover = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & TextStaggerHoverProps
>(({ text, index, className, ...props }, ref) => {
  const { activeSlide, changeSlide } = useHoverSliderContext();
  const { characters } = splitText(text);
  const isActive = activeSlide === index;

  return (
    <span
      className={cn("relative inline-block origin-bottom overflow-hidden whitespace-nowrap", className)}
      {...props}
      ref={ref}
      onMouseEnter={() => changeSlide(index)}
    >
      {characters.map((char, charIndex) => (
        <span
          key={`${char}-${charIndex}`}
          className="relative inline-block overflow-hidden"
        >
          <MotionConfig
            transition={{
              delay: charIndex * 0.018,
              duration: 0.28,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <motion.span
              className="inline-block opacity-55"
              initial={{ y: "0%" }}
              animate={isActive ? { y: "-110%" } : { y: "0%" }}
            >
              {char}
              {char === " " && charIndex < characters.length - 1 && <>&nbsp;</>}
            </motion.span>

            <motion.span
              className="absolute left-0 top-0 inline-block opacity-100"
              initial={{ y: "110%" }}
              animate={isActive ? { y: "0%" } : { y: "110%" }}
            >
              {char}
              {char === " " && charIndex < characters.length - 1 && <>&nbsp;</>}
            </motion.span>
          </MotionConfig>
        </span>
      ))}
    </span>
  );
});
TextStaggerHover.displayName = "TextStaggerHover";
