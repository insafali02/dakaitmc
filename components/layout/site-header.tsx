import Link from "next/link";

import { settingValue } from "@/lib/utils";
import type { SiteSetting } from "@/lib/types";

type SiteHeaderProps = {
  settings: SiteSetting[];
};

const links = [
  { href: "/", label: "Home" },
  { href: "/ranks", label: "Ranks" },
  { href: "/store", label: "Store" },
  { href: "/tags", label: "Tags" },
  { href: "/rules", label: "Rules" },
  { href: "/faq", label: "FAQ" },
  { href: "/staff", label: "Staff" }
];

export function SiteHeader({ settings }: SiteHeaderProps) {
  const discordUrl = settingValue(settings, "discord_url", "https://discord.gg/dakaitmc");
  const ctaText = settingValue(settings, "primary_cta", "Join the Outlaws");

  return (
    <header className="sticky top-0 z-50 border-b border-white/15 bg-coal/65 backdrop-blur-xl">
      <div className="section-shell flex h-20 items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex flex-col leading-none"
        >
          <span className="text-[0.58rem] uppercase tracking-[0.3em] text-frost/70">Wasteland Network</span>
          <span className="font-heading text-3xl uppercase tracking-[0.12em] text-sand transition group-hover:text-white">
            Dakait MC
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-[0.68rem] uppercase tracking-[0.22em] text-frost/80 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative transition hover:text-white after:absolute after:bottom-[-7px] after:left-0 after:h-px after:w-0 after:bg-azure after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href={discordUrl}
          className="rounded-sm border border-azure/70 bg-azure/20 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-frost shadow-[0_0_20px_rgba(47,159,255,0.28)] transition hover:border-frost hover:bg-ember/35 hover:shadow-[0_0_24px_rgba(255,74,74,0.35)]"
        >
          {ctaText}
        </Link>
      </div>
    </header>
  );
}
