"use client";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonWithIconDemoProps {
  children?: React.ReactNode;
  className?: string;
  href?: string;
}

const ButtonWithIconDemo = ({
  children = "Let's Collaborate",
  className,
  href,
}: ButtonWithIconDemoProps) => {
  const handleClick = () => {
    if (href) window.location.href = href;
  };

  return (
    <Button
      onClick={handleClick}
      className={cn(
        "relative h-12 w-fit cursor-pointer overflow-hidden rounded-full bg-[#0071e3] p-1 pe-14 ps-6 text-sm font-medium text-white transition-all duration-500 hover:bg-[#0077ed] hover:pe-6 hover:ps-14",
        "group border-0 shadow-none focus-visible:ring-[#0071e3]/25",
        className
      )}
    >
      <span className="relative z-10 transition-all duration-500">
        {children}
      </span>
      <div className="absolute right-1 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0071e3] transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
        <ArrowUpRight size={16} />
      </div>
    </Button>
  );
};

export default ButtonWithIconDemo;
