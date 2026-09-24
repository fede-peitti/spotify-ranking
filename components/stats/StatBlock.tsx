import type { ReactNode } from "react";
import { SectionReveal } from "@/components/layout/SectionReveal";

export function StatBlock({
  eyebrow,
  title,
  subtitle,
  children,
  caption,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  caption?: string;
}) {
  return (
    <SectionReveal>
      <div className="w-full">
        <div className="mb-6">
          {eyebrow && (
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-2">
              {eyebrow}
            </p>
          )}
          <h3 className="text-2xl md:text-3xl font-bold">{title}</h3>
          {subtitle && (
            <p className="text-white/60 mt-2 max-w-2xl">{subtitle}</p>
          )}
        </div>
        {children}
        {caption && (
          <p className="text-sm text-white/40 mt-4 max-w-2xl">{caption}</p>
        )}
      </div>
    </SectionReveal>
  );
}