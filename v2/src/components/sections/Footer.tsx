import { contact } from "@/lib/data";

export function Footer() {
  return (
    <footer
      className="py-8"
      style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="max-w-content mx-auto px-6 sm:px-10 lg:px-20 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <span
            className="font-barlow-sc font-black text-base text-[#E50914]"
            style={{ textShadow: "0 0 12px rgba(229,9,20,0.4)" }}
          >
            RE
          </span>
          <span className="font-barlow font-medium text-sm text-white/40">
            Reda Essabre · Data Engineer & Automation Expert
          </span>
        </div>

        <div className="flex items-center gap-5">
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] tracking-[0.1em] uppercase text-white/20 hover:text-white/50 transition-colors duration-150"
          >
            LinkedIn ↗
          </a>
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] tracking-[0.1em] uppercase text-white/20 hover:text-white/50 transition-colors duration-150"
          >
            GitHub ↗
          </a>
          <span className="font-mono text-[10px] text-white/15">
            © 2025 · Paris, France
          </span>
        </div>
      </div>
    </footer>
  );
}
