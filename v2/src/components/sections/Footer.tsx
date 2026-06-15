import { contact } from "@/lib/data";
import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/shared/SocialIcons";

export function Footer() {
  return (
    <footer
      className="bg-white py-8"
      style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}
    >
      <div className="max-w-content mx-auto px-6 sm:px-10 lg:px-20 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <span
            className="font-semibold text-base text-[#0071e3]"
            style={{ textShadow: "none" }}
          >
            RE
          </span>
          <span className="apple-text" style={{ fontSize: "13px" }}>
            Reda Essabre · Senior Data Services Consultant
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`mailto:${contact.email}`}
            aria-label="Email Reda"
            title="Email"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#6e6e73] transition-colors duration-150 hover:text-[#1d1d1f]"
          >
            <Mail size={16} />
          </a>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            title="LinkedIn"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#6e6e73] transition-colors duration-150 hover:text-[#1d1d1f]"
          >
            <LinkedInIcon size={16} />
          </a>
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            title="GitHub"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#6e6e73] transition-colors duration-150 hover:text-[#1d1d1f]"
          >
            <GitHubIcon size={16} />
          </a>
          <span className="text-[13px] text-[#86868b]">
            © 2026 · Paris, France
          </span>
        </div>
      </div>
    </footer>
  );
}
