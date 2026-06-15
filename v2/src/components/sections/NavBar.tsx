"use client";

import { useState } from "react";
import { useScrolled } from "@/hooks/useScrolled";
import { X, Menu } from "lucide-react";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Expertise", href: "#expertise" },
  { label: "About", href: "#about" },
];

function NavLink({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="font-barlow-sc font-bold uppercase tracking-widest relative"
      style={{
        fontSize: "13px",
        letterSpacing: "0.12em",
        color: hovered ? "#ffffff" : "rgba(255,255,255,0.45)",
        textShadow: hovered
          ? "0 0 12px rgba(0,113,227,0.7), 0 0 30px rgba(0,113,227,0.3)"
          : "none",
        transition: "color 0.2s, text-shadow 0.2s",
      }}
    >
      {label}
      {/* underline LED */}
      <span
        className="absolute left-0 right-0 bottom-[-3px] h-px block"
        style={{
          background: hovered
            ? "linear-gradient(90deg, transparent, rgba(0,113,227,0.8), transparent)"
            : "transparent",
          boxShadow: hovered ? "0 0 6px rgba(0,113,227,0.5)" : "none",
          transition: "all 0.2s",
        }}
      />
    </a>
  );
}

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
                borderBottom: "1px solid rgba(0,113,227,0.15)",
                boxShadow: "0 1px 0 rgba(0,113,227,0.08)",
              }
            : undefined
        }
      >
        <div className="max-w-content mx-auto px-6 sm:px-10 lg:px-20 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span
              className="font-barlow-sc font-black text-lg text-[#0071e3] tracking-tight"
              style={{ textShadow: "0 0 16px rgba(0,113,227,0.5)" }}
            >
              RE
            </span>
            <div className="w-px h-4 bg-white/10" />
            <span
              className="font-barlow-sc font-bold text-sm uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.75)", letterSpacing: "0.1em" }}
            >
              Reda Essabre
            </span>
          </div>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.href} label={link.label} href={link.href} />
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <a
              href="#contact"
              className="hidden md:inline-flex font-barlow-sc font-bold uppercase text-white px-4 py-2 rounded-[5px] transition-all duration-200"
              style={{
                fontSize: "12px",
                letterSpacing: "0.1em",
                background: "#0071e3",
                boxShadow: "0 0 16px rgba(0,113,227,0.4), 0 0 6px rgba(0,113,227,0.3)",
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
            className="font-barlow-sc font-bold uppercase text-white px-8 py-3 rounded-[5px] mt-4"
            style={{ fontSize: "13px", letterSpacing: "0.1em", background: "#0071e3", boxShadow: "0 0 20px rgba(0,113,227,0.5)" }}
          >
            Let&apos;s Talk
          </a>
        </div>
      )}
    </>
  );
}
