interface SectionLabelProps {
  number: string;
  text: string;
  className?: string;
}

export function SectionLabel({ number, text, className = "" }: SectionLabelProps) {
  return (
    <p
      className={`font-mono text-[12px] tracking-normal text-[#86868b] mb-3 ${className}`}
    >
      {`${number}. ${text}`}
    </p>
  );
}
