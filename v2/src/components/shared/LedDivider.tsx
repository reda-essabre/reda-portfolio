export function LedDivider() {
  return (
    <div className="relative h-px w-full my-0" aria-hidden="true">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-full max-w-[980px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)",
          boxShadow: "none",
        }}
      />
    </div>
  );
}
