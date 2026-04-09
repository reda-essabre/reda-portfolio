"use client";

import { useState } from "react";
import { useScrolled } from "@/hooks/useScrolled";
import { X, Menu } from "lucide-react";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Expertise", href: "#expertise" },
  { label: "About", href: "#about" },
];

export function NavBar() {
  const scrolled = useScrolled(50);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={
          scrolled
            ? {
                background: "rgba(10,10,10,0.88)",
                backdropFilter: "blur(16px)",
                borderBottom: "1px solid rgba(229,9,20,0.15)",
                boxShadow: "0 1px 0 rgba(229,9,20,0.08)",
              }
            : undefined
        }
      >
        <div className="max-w-content mx-auto px-6 sm:px-10 lg:px-20 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span
              className="font-barlow-sc font-black text-lg text-[#E50914] tracking-tight"
              style={{ textShadow: "0 0 16px rgba(229,9,20,0.5)" }}
            >
              RE
            </span>
            <div className="w-px h-4 bg-white/10" />
            <span className="font-barlow font-semibold text-sm text-white">
              Reda Essabre
            </span>
          </div>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-barlow text-sm text-white/40 hover:text-white transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <a
              href="#contact"
              className="hidden md:inline-flex font-barlow font-semibold text-sm text-white px-4 py-2 rounded-[5px] transition-all duration-200"
              style={{
                background: "#E50914",
                boxShadow: "0 0 16px rgba(229,9,20,0.4), 0 0 6px rgba(229,9,20,0.3)",
              }}
            >
              Let&apos;s Talk
            </a>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-white/60 hover:text-white"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 md:hidden"
          style={{ background: "rgba(10,10,10,0.97)", backdropFilter: "blur(16px)" }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-barlow-sc font-black text-3xl uppercase text-white/70 hover:text-white tracking-tight"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="font-barlow font-semibold text-base text-white px-8 py-3 rounded-[5px] mt-4"
            style={{ background: "#E50914", boxShadow: "0 0 20px rgba(229,9,20,0.5)" }}
          >
            Let&apos;s Talk
          </a>
        </div>
      )}
    </>
  );
}
