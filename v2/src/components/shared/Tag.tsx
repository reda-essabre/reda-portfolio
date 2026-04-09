interface TagProps {
  label: string;
}

export function Tag({ label }: TagProps) {
  return (
    <span
      className="font-mono text-[8px] tracking-[0.08em] uppercase text-white/20 border border-white/[0.07] px-[7px] py-[2px] rounded-[3px]"
    >
      {label}
    </span>
  );
}
