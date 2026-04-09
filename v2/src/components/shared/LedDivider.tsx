export function LedDivider() {
  return (
    <div className="relative h-px w-full my-0" aria-hidden="true">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(229,9,20,0.5), transparent)",
          boxShadow:
            "0 0 8px 2px rgba(229,9,20,0.2), 0 0 20px 6px rgba(229,9,20,0.08)",
        }}
      />
    </div>
  );
}
