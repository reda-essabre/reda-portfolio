"use client";

import { Mail } from "lucide-react";
import { contact } from "@/lib/data";
import { GitHubIcon, LinkedInIcon } from "@/components/shared/SocialIcons";

export function FinalCTA() {
  return (
    <section
        id="contact"
        className="relative overflow-hidden bg-[#f5f5f7] py-32 text-center"
      >
        <div className="relative z-10 max-w-2xl mx-auto px-6 sm:px-10">
          <h2
            className="font-semibold text-[#1d1d1f] leading-none mb-5"
            style={{ fontSize: "clamp(40px, 6vw, 72px)", letterSpacing: "-0.05em" }}
          >
            Have a system<br />to build?
          </h2>

          <p className="apple-text mb-10" style={{ fontSize: "17px" }}>
            Available for senior data services consulting, contracts, and remote work.
            Response within 24 hours.
          </p>

          {/* Primary CTA */}
          <div className="mb-10">
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex font-medium text-white px-8 py-3 transition-transform duration-200 hover:scale-[1.02]"
              style={{
                background: "#0071e3",
                fontSize: "16px",
                borderRadius: "999px",
                boxShadow: "none",
              }}
            >
              Let&apos;s Talk →
            </a>
          </div>

          <div className="flex justify-center gap-3 flex-wrap">
            <a
              href={`mailto:${contact.email}`}
              aria-label="Email Reda"
              title="Email"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#1d1d1f] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1d1d1f] hover:text-[#e1e0cc]"
            >
              <Mail size={18} />
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              title="LinkedIn"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#1d1d1f] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1d1d1f] hover:text-[#e1e0cc]"
            >
              <LinkedInIcon size={18} />
            </a>
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              title="GitHub"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#1d1d1f] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1d1d1f] hover:text-[#e1e0cc]"
            >
              <GitHubIcon size={18} />
            </a>
          </div>
        </div>
      </section>
  );
}
