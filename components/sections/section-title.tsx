import type { ReactNode } from "react";

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export function SectionTitle({ eyebrow, title, subtitle, action }: SectionTitleProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
      <div>
        {eyebrow ? (
          <p className="text-[0.63rem] uppercase tracking-[0.22em] text-sand/60">{eyebrow}</p>
        ) : null}
        <h2 className="mt-2 font-display text-4xl uppercase leading-none tracking-[0.06em] text-sand md:text-5xl">
          {title}
        </h2>
        <div className="burn-line mt-3 max-w-24" />
        {subtitle ? <p className="mt-3 max-w-2xl text-sm text-sand/80">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
