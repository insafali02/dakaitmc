import Link from "next/link";

import type { SiteSetting } from "@/lib/types";
import { settingValue } from "@/lib/utils";

type SiteFooterProps = {
  settings: SiteSetting[];
};

export function SiteFooter({ settings }: SiteFooterProps) {
  const discordUrl = settingValue(settings, "discord_url", "https://discord.gg/dakaitmc");
  const serverIp = settingValue(settings, "server_ip", "play.dakaitmc.net");

  return (
    <footer className="mt-24 border-t border-white/15 bg-black/40">
      <div className="section-shell grid gap-8 py-12 md:grid-cols-3">
        <div>
          <p className="font-heading text-3xl uppercase tracking-[0.12em] text-sand">Dakait MC</p>
          <p className="mt-3 max-w-xs text-sm text-frost/75">
            Brutal economy. Outlaw politics. Bandit-style survival with real stakes.
          </p>
        </div>

        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.18em] text-frost/65">Server IP</p>
          <p className="mt-2 inline-flex rounded-sm border border-azure/35 bg-azure/10 px-3 py-2 font-mono text-sm text-white">
            {serverIp}
          </p>
        </div>

        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.18em] text-frost/65">Community</p>
          <Link
            href={discordUrl}
            className="mt-2 inline-flex rounded-sm border border-ember/60 px-3 py-2 text-sm text-ember transition hover:border-frost hover:bg-ember/20 hover:text-frost"
          >
            Join Discord
          </Link>
        </div>
      </div>
    </footer>
  );
}
