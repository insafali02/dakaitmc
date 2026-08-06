import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { DiscordTicketGateLink } from "@/components/common/discord-ticket-gate-link";
import { PixelGallery, type PixelItem } from "@/components/sections/pixel-gallery";
import { Reveal } from "@/components/sections/reveal";
import { SectionTitle } from "@/components/sections/section-title";
import { getRankComparisonRows, getRanks, getSiteSettings } from "@/lib/data/public";
import type { Rank, RankComparisonRow } from "@/lib/types";
import { cleanGlyphText, formatPkr, resolveActionUrl, resolveImageSrc, settingValue } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dakait MC Ranks | FREE, VIP, ELITE, DEADLIEST, OBLIX",
  description:
    "Explore Dakait MC rank cards with editable features, prices, and perks. View FREE, VIP, ELITE, DEADLIEST, and OBLIX."
};

const rankFieldByCode = {
  FREE: "free_value",
  VIP: "vip_value",
  ELITE: "elite_value",
  DEADLIEST: "deadliest_value",
  OBLIX: "oblix_value"
} as const;

type RankCode = keyof typeof rankFieldByCode;

const rankBackdropByCode: Record<string, string> = {
  FREE: "/media/minecraft/dungeons-camp-day.png",
  VIP: "/media/minecraft/dungeons-main.png",
  ELITE: "/media/minecraft/dungeons-echoing-void.png",
  DEADLIEST: "/media/minecraft/dungeons-flames-nether.png",
  OBLIX: "/media/minecraft/dungeons-ultimate.png"
};

function valueForRank(row: RankComparisonRow, rank: Rank) {
  const code = String(rank.code || "").toUpperCase() as RankCode;
  const field = rankFieldByCode[code];
  if (!field) return "\u2717";
  return cleanGlyphText(row[field] || "\u2717");
}

function parseFeatureValue(value: string) {
  const clean = cleanGlyphText(value || "").trim();
  if (!clean) return { status: "text" as const, label: "-", showLabel: true };

  if (clean === "\u2713") {
    return { status: "check" as const, label: "", showLabel: false };
  }

  if (clean === "\u2717") {
    return { status: "cross" as const, label: "", showLabel: false };
  }

  if (clean.startsWith("\u2713")) {
    const tail = clean.slice(1).trim();
    const generic = /^(enabled|yes|true)$/i.test(tail);
    return { status: "check" as const, label: generic ? "" : tail, showLabel: !generic && Boolean(tail) };
  }

  if (clean.startsWith("\u2717")) {
    const tail = clean.slice(1).trim();
    const generic = /^(disabled|no|false|none|na|n\/a)$/i.test(tail);
    return { status: "cross" as const, label: generic ? "" : tail, showLabel: !generic && Boolean(tail) };
  }

  if (/disabled/i.test(clean)) {
    return { status: "cross" as const, label: "", showLabel: false };
  }

  if (/enabled/i.test(clean)) {
    return { status: "check" as const, label: "", showLabel: false };
  }

  return { status: "text" as const, label: clean, showLabel: true };
}

function resolvePrimaryCtaLabel(rank: Rank) {
  const raw = (rank.cta_label || "").trim();
  if (!raw || /^\d+$/.test(raw)) {
    return String(rank.code || "").toUpperCase() === "FREE" ? "Join Discord" : "Buy Now";
  }
  return raw;
}

function rankBackdrop(rank: Rank, index: number) {
  if (rank.image_path) return resolveImageSrc(rank.image_path);

  const code = String(rank.code || "").toUpperCase();
  if (rankBackdropByCode[code]) return rankBackdropByCode[code];

  const pool = [
    "/media/minecraft/dungeons-main.png",
    "/media/minecraft/dungeons-howling-peaks.png",
    "/media/minecraft/minecraft-nether-update.png",
    "/media/minecraft/minecraft-bedrock.png"
  ];
  return pool[index % pool.length];
}

export default async function RanksPage() {
  const [ranks, rows, settings] = await Promise.all([
    getRanks(),
    getRankComparisonRows(),
    getSiteSettings()
  ]);

  const discordUrl = settingValue(settings, "discord_url", "https://discord.gg/dakaitmc");
  const featureRows = rows.filter((row) => row.feature_name.trim().toLowerCase() !== "action");
  const rankScenes: PixelItem[] = [
    {
      src: "/media/minecraft/dungeons-echoing-void.png",
      title: "Rank Ladder",
      subtitle: "FREE to OBLIX",
      tone: "blue",
      animated: true
    },
    {
      src: "/media/minecraft/dungeons-howling-peaks.png",
      title: "Combat Perks",
      subtitle: "PvP Utility",
      tone: "red",
      animated: true
    },
    {
      src: "/media/minecraft/dungeons-ultimate.png",
      title: "Kit Access",
      subtitle: "VIP to Oblix",
      tone: "orange",
      animated: false
    }
  ];

  return (
    <div className="section-shell py-14">
      <Reveal>
        <SectionTitle
          eyebrow="Power Ladder"
          title="Ranks"
          subtitle="Choose your tier and review every perk from the live feature list."
        />
      </Reveal>

      <Reveal delay={0.07}>
        <PixelGallery items={rankScenes} className="mb-7 xl:grid-cols-3" />
      </Reveal>

      <section className="mt-6">
        <Reveal>
          <SectionTitle
            eyebrow="Rank Cards"
            title="Choose Your Tier"
            subtitle="Add, remove, and edit rank features from Admin > Rank Features, and cards update instantly."
          />
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-2">
          {ranks.map((rank, index) => {
            const primaryLabel = resolvePrimaryCtaLabel(rank);
            const primaryHref = resolveActionUrl(rank.cta_url, discordUrl);
            const shouldGatePrimary = /buy\s*now/i.test(primaryLabel);

            return (
            <Reveal key={rank.id} delay={index * 0.07}>
              <article className="rank-card-v2">
                <div className="rank-card-hero">
                  <Image
                    src={rankBackdrop(rank, index)}
                    alt={rank.title}
                    fill
                    className="object-cover object-center"
                  />
                  <div className="rank-card-hero-overlay" />
                  <span className="rank-card-badge">Tier {index + 1}</span>
                  <div className="rank-card-headline">
                    <p className="rank-card-subtitle">{rank.subtitle || `${rank.title} RANK`}</p>
                    <h3 className="rank-card-title">{rank.title}</h3>
                  </div>
                </div>

                <div className="mt-3 flex items-end justify-between gap-3 border-b border-white/10 pb-2">
                  <p className="text-[0.62rem] uppercase tracking-[0.14em] text-sand/70">Package Price</p>
                  <p className="text-lg font-semibold text-ember">
                    {rank.invite_requirement || formatPkr(rank.price_pkr)}
                  </p>
                </div>

                <ul className="mt-4 space-y-1 text-sm text-sand/90">
                  {featureRows.map((row) => {
                    const parsed = parseFeatureValue(valueForRank(row, rank));
                    return (
                      <li key={`${rank.id}-${row.id}`} className="rank-feature-row">
                        <span className="rank-feature-key">{row.feature_name}</span>
                        <span className="rank-feature-value">
                          {parsed.status === "check" ? (
                            <span className="glyph-badge glyph-badge-check">{"\u2713"}</span>
                          ) : null}
                          {parsed.status === "cross" ? (
                            <span className="glyph-badge glyph-badge-cross">{"\u2717"}</span>
                          ) : null}
                          {parsed.showLabel ? <span>{parsed.label}</span> : null}
                        </span>
                      </li>
                    );
                  })}
                  {featureRows.length === 0 ? (
                    <li className="rank-feature-row">
                      <span className="rank-feature-key">Features</span>
                      <span className="rank-feature-value">No features published yet.</span>
                    </li>
                  ) : null}
                </ul>

                <div className="mt-5 flex flex-wrap gap-3">
                  <DiscordTicketGateLink
                    href={primaryHref}
                    label={primaryLabel}
                    gate={shouldGatePrimary}
                    className="rounded-sm border border-ember bg-ember/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-sand shadow-[0_0_20px_rgba(236,114,50,0.2)] transition hover:bg-ember/35"
                  />
                  <Link
                    href={discordUrl}
                    className="rounded-sm border border-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-sand transition hover:border-sand hover:bg-white/10"
                  >
                    Join Discord
                  </Link>
                </div>
              </article>
            </Reveal>
            );
          })}
          {ranks.length === 0 ? <p className="text-sm text-sand/70">No ranks published yet.</p> : null}
        </div>
      </section>
    </div>
  );
}
