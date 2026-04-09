interface SectionLabelProps {
  number: string;
  text: string;
  className?: string;
}

export function SectionLabel({ number, text, className = "" }: SectionLabelProps) {
  return (
    <p
      className={`font-mono text-[10px] tracking-[0.2em] uppercase text-white/20 mb-2 ${className}`}
    >
      // {number} — {text}
    </p>
  );
}
