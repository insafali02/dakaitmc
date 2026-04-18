import type { Metadata } from "next";
import Link from "next/link";

import { PixelGallery, type PixelItem } from "@/components/sections/pixel-gallery";
import { Reveal } from "@/components/sections/reveal";
import { SectionTitle } from "@/components/sections/section-title";
import { getRankComparisonRows, getRanks, getSiteSettings } from "@/lib/data/public";
import type { Rank } from "@/lib/types";
import { booleanGlyph, cleanGlyphText, formatPkr, resolveActionUrl, settingValue } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dakait MC Ranks | FREE, VIP, ELITE, DEADLIEST, OBLIX",
  description:
    "Compare Dakait MC ranks with full features matrix, prices, and kit details. View FREE, VIP, ELITE, DEADLIEST, and OBLIX perks."
};

const commandFields: Array<{ label: string; key: keyof Rank }> = [
  { label: "/craft", key: "craft" },
  { label: "/recipe", key: "recipe" },
  { label: "/disposal", key: "disposal" },
  { label: "/near", key: "near" },
  { label: "/hat", key: "hat" },
  { label: "/feed", key: "feed" },
  { label: "/invsee", key: "invsee" },
  { label: "/enderchest", key: "enderchest" },
  { label: "/ptime", key: "ptime" },
  { label: "/pweather", key: "pweather" }
];

const CHECK = "\u2713";
const CROSS = "\u2717";

function textValue(
  value: string | null | undefined,
  enabled: boolean,
  showDisabledValue = false
) {
  if (!value) return CROSS;

  const clean = cleanGlyphText(value);
  if (enabled) return `${CHECK} ${clean}`;
  if (showDisabledValue) return `${clean} ${CROSS}`;
  return CROSS;
}

export default async function RanksPage() {
  const [ranks, rows, settings] = await Promise.all([
    getRanks(),
    getRankComparisonRows(),
    getSiteSettings()
  ]);

  const discordUrl = settingValue(settings, "discord_url", "https://discord.gg/dakaitmc");
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
          title="Rank Comparison"
          subtitle="Compare every perk, command, and kit before choosing your tier."
        />
      </Reveal>

      <Reveal delay={0.07}>
        <PixelGallery items={rankScenes} className="mb-7 xl:grid-cols-3" />
      </Reveal>

      <Reveal delay={0.08}>
        <div className="metal-panel overflow-x-auto rounded-md bg-black/25">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-orange-200/15 text-xs uppercase tracking-[0.16em] text-sand/70">
                <th className="px-4 py-4">Features</th>
                {ranks.map((rank) => (
                  <th key={rank.id} className="min-w-[170px] px-4 py-4">
                    <p className="font-display text-2xl tracking-[0.06em] text-sand">{rank.title}</p>
                    <p className="mt-1 text-[0.65rem] text-sand/60">
                      {rank.invite_requirement || formatPkr(rank.price_pkr)}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-white/5 text-sand/85">
                  <td className="px-4 py-3 text-xs uppercase tracking-[0.13em] text-sand/65">
                    {row.feature_name}
                  </td>
                  <td className="px-4 py-3">{cleanGlyphText(row.free_value)}</td>
                  <td className="px-4 py-3">{cleanGlyphText(row.vip_value)}</td>
                  <td className="px-4 py-3">{cleanGlyphText(row.elite_value)}</td>
                  <td className="px-4 py-3">{cleanGlyphText(row.deadliest_value)}</td>
                  <td className="px-4 py-3">{cleanGlyphText(row.oblix_value)}</td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-sm text-sand/70" colSpan={6}>
                    No comparison rows published yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Reveal>

      <section className="mt-14">
        <Reveal>
          <SectionTitle
            eyebrow="Rank Cards"
            title="Choose Your Tier"
            subtitle="Edit values from admin and this section updates instantly."
          />
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-2">
          {ranks.map((rank, index) => (
            <Reveal key={rank.id} delay={index * 0.07}>
              <article className="metal-panel rounded-md p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[0.62rem] uppercase tracking-[0.17em] text-sand/60">
                      {rank.subtitle || `${rank.title} RANK`}
                    </p>
                    <h3 className="mt-1 font-display text-4xl uppercase tracking-[0.06em] text-sand">
                      {rank.title}
                    </h3>
                  </div>
                  <p className="text-lg font-semibold text-ember">
                    {rank.invite_requirement || formatPkr(rank.price_pkr)}
                  </p>
                </div>

                <ul className="mt-5 grid gap-2 text-sm text-sand/80 sm:grid-cols-2">
                  <li className="flex justify-between gap-3 border-b border-white/5 py-1">
                    <span className="text-xs uppercase tracking-[0.12em] text-sand/60">Chat Colour</span>
                    <span>{textValue(rank.chat_colour, rank.code !== "FREE")}</span>
                  </li>
                  <li className="flex justify-between gap-3 border-b border-white/5 py-1">
                    <span className="text-xs uppercase tracking-[0.12em] text-sand/60">Homes</span>
                    <span>{textValue(rank.homes, rank.code !== "FREE", true)}</span>
                  </li>
                  <li className="flex justify-between gap-3 border-b border-white/5 py-1">
                    <span className="text-xs uppercase tracking-[0.12em] text-sand/60">/vaults</span>
                    <span>{rank.vaults ? cleanGlyphText(rank.vaults) : CROSS}</span>
                  </li>
                  <li className="flex justify-between gap-3 border-b border-white/5 py-1">
                    <span className="text-xs uppercase tracking-[0.12em] text-sand/60">Auction Slots</span>
                    <span>{textValue(rank.auction_slots, true)}</span>
                  </li>

                  {commandFields.map((field) => {
                    const value = rank[field.key];
                    const text =
                      typeof value === "boolean"
                        ? booleanGlyph(value)
                        : typeof value === "string"
                          ? cleanGlyphText(value)
                          : value === null || value === undefined
                            ? CROSS
                            : String(value);
                    return (
                      <li key={field.label} className="flex justify-between gap-3 border-b border-white/5 py-1">
                        <span className="text-xs uppercase tracking-[0.12em] text-sand/60">
                          {field.label}
                        </span>
                        <span>{text}</span>
                      </li>
                    );
                  })}

                  <li className="flex justify-between gap-3 border-b border-white/5 py-1">
                    <span className="text-xs uppercase tracking-[0.12em] text-sand/60">Kit</span>
                    <span>{rank.kit_name ? cleanGlyphText(rank.kit_name) : CROSS}</span>
                  </li>
                </ul>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={resolveActionUrl(rank.cta_url, discordUrl)}
                    className="rounded-sm border border-ember bg-ember/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-sand shadow-[0_0_20px_rgba(236,114,50,0.2)] transition hover:bg-ember/35"
                  >
                    {rank.cta_label}
                  </Link>
                  <Link
                    href={discordUrl}
                    className="rounded-sm border border-white/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-sand transition hover:border-sand hover:bg-white/10"
                  >
                    Join Discord
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
          {ranks.length === 0 ? <p className="text-sm text-sand/70">No ranks published yet.</p> : null}
        </div>
      </section>
    </div>
  );
}
