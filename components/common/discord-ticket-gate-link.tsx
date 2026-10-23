"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type DiscordTicketGateLinkProps = {
  href: string;
  label: string;
  className: string;
  gate?: boolean;
};

export function DiscordTicketGateLink({
  href,
  label,
  className,
  gate = false
}: DiscordTicketGateLinkProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!gate) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-md border border-white/20 bg-[linear-gradient(160deg,rgba(8,15,36,0.97)_0%,rgba(4,10,27,0.98)_100%)] p-5 shadow-[0_20px_60px_rgba(2,6,18,0.78)]">
            <p className="text-[0.64rem] uppercase tracking-[0.16em] text-sand/60">Purchase Flow</p>
            <h3 className="mt-2 font-display text-3xl uppercase tracking-[0.08em] text-sand">
              Before You Continue
            </h3>
            <p className="mt-3 text-sm text-sand/80">
              To get this, you will have to go to Discord and create a ticket.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={href}
                className="rounded-sm border border-ember bg-ember/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-sand transition hover:bg-ember/35"
              >
                Open Discord
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-sm border border-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-sand transition hover:border-sand hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

