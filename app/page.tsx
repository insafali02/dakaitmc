import Link from "next/link";
import Image from "next/image";

import { Reveal } from "@/components/sections/reveal";
import { PixelGallery, type PixelItem } from "@/components/sections/pixel-gallery";
import { SectionTitle } from "@/components/sections/section-title";
import { getAnnouncements, getRanks, getSiteSettings, getTags, getVisualFeedItems } from "@/lib/data/public";
import { formatPkr, settingValue } from "@/lib/utils";

export default async function HomePage() {
  const [settings, ranks, announcements, tags, visualFeedItems] = await Promise.all([
    getSiteSettings(),
    getRanks(),
    getAnnouncements(),
    getTags(),
    getVisualFeedItems()
  ]);

  const discordUrl = settingValue(settings, "discord_url", "https://discord.gg/dakaitmc");
  const serverIp = settingValue(settings, "server_ip", "play.dakaitmc.net");
  const sceneShots: PixelItem[] = visualFeedItems.map((item, index) => ({
    src: item.image_path || "/media/minecraft/dungeons-main.png",
    title: item.title,
    subtitle: item.subtitle || undefined,
    tone: (["blue", "red", "orange", "white"] as const)[index % 4],
    animated: index === 0
  }));

  return (
    <>
      <section className="relative overflow-hidden border-b border-orange-200/10">
        <div className="absolute inset-0">
          <Image
            src="/media/minecraft/dungeons-luminous-night.png"
            alt="Minecraft Dungeons battleground"
            fill
            className="object-cover object-center opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-[linear-gradient(104deg,rgba(2,5,12,0.82)_16%,rgba(4,8,18,0.38)_54%,rgba(1,2,7,0.88)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_12%,rgba(255,146,31,0.2),transparent_42%)]" />
        </div>
        <div className="section-shell relative grid min-h-[calc(100svh-5rem)] items-center gap-16 py-16 md:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <p className="text-[0.65rem] uppercase tracking-[0.24em] text-sand/70">
              Dakait Protocol // Season: Dustfall Uprising
            </p>
            <h1 className="mt-4 font-heading text-[3.4rem] uppercase leading-[0.94] tracking-[0.07em] text-sand md:text-[6.3rem]">
              Dakait
              <br />
              MC
            </h1>
            <p className="mt-5 max-w-xl text-base text-sand/80 md:text-xl">
              Not a friendly SMP. This is outlaw territory where ranks control movement, kits
              decide wars, and every raid shifts power.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/store"
                className="rounded-sm border border-ember bg-ember/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-sand shadow-[0_0_28px_rgba(236,114,50,0.28)] transition hover:bg-ember/40 hover:shadow-[0_0_36px_rgba(236,114,50,0.4)]"
              >
                Enter Store
              </Link>
              <Link
                href={discordUrl}
                className="rounded-sm border border-white/30 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-sand transition hover:border-sand hover:bg-white/10"
              >
                Join Discord
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              <span className="signal-pill">Hardcore Economy</span>
              <span className="signal-pill">Faction Tension</span>
              <span className="signal-pill">Elite Kits Enabled</span>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="grain-overlay metal-panel rounded-md p-6">
              <div className="pixel-frame pixel-tone-blue mb-5 overflow-hidden rounded-sm border">
                <Image
                  src="/media/minecraft/dungeons-camp-day.png"
                  alt="Dakait MC Command Outpost"
                  width={1024}
                  height={576}
                  className="h-44 w-full bg-black object-cover"
                />
              </div>
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-sand/65">Outlaw Command Board</p>
              <p className="mt-2 text-sm text-sand/70">Track strategic data before entering the frontier.</p>
              <dl className="mt-6 space-y-6">
                <div className="rounded-sm border border-amber-200/10 bg-black/20 p-3">
                  <dt className="text-[0.63rem] uppercase tracking-[0.18em] text-sand/55">Server IP</dt>
                  <dd className="mt-1 font-mono text-base text-white">{serverIp}</dd>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-sm border border-amber-200/10 bg-black/20 p-3">
                    <dt className="text-[0.6rem] uppercase tracking-[0.14em] text-sand/55">Status</dt>
                    <dd className="mt-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-emerald-300">
                      <span className="size-2 rounded-full bg-emerald-400" />
                      Online
                    </dd>
                  </div>
                  <div className="rounded-sm border border-amber-200/10 bg-black/20 p-3">
                    <dt className="text-[0.6rem] uppercase tracking-[0.14em] text-sand/55">Heat Index</dt>
                    <dd className="mt-2 text-sm text-amber-200">High Conflict</dd>
                  </div>
                </div>
                <div>
                  <dt className="text-[0.6rem] uppercase tracking-[0.14em] text-sand/55">Top Ranks</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {ranks.slice(-3).map((rank) => (
                      <span
                        key={rank.id}
                        className="rounded-sm border border-ember/30 bg-ember/10 px-2 py-1 text-[0.62rem] uppercase tracking-[0.14em] text-sand"
                      >
                        {rank.title}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>

        <div className="section-shell pb-10">
          <div className="metal-panel rounded-sm px-4 py-3 text-[0.64rem] uppercase tracking-[0.22em] text-sand/70">
            Live Signals: bounty contracts active | ranked raids open | elite kits section armed
          </div>
        </div>
      </section>

      <section className="section-shell py-14">
        <Reveal>
          <SectionTitle
            eyebrow="Live Broadcast"
            title="Server Visual Feed"
            subtitle="Real Minecraft captures from critical Dakait zones and events."
          />
        </Reveal>
        <Reveal delay={0.08}>
          <PixelGallery items={sceneShots} />
        </Reveal>
      </section>

      <section className="section-shell py-16">
        <Reveal>
          <SectionTitle
            eyebrow="Power Structure"
            title="Featured Ranks"
            subtitle="Pick your rise from survival drifter to full outlaw command."
            action={
              <Link
                href="/ranks"
                className="text-[0.65rem] uppercase tracking-[0.2em] text-ember transition hover:text-sand"
              >
                Full Comparison
              </Link>
            }
          />
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {ranks.slice(1, 4).map((rank, index) => (
            <Reveal key={rank.id} delay={index * 0.08}>
              <article className="metal-panel grain-overlay rounded-md p-5">
                <p className="text-[0.62rem] uppercase tracking-[0.16em] text-sand/65">Tier {index + 1}</p>
                <p className="mt-1 font-display text-3xl uppercase tracking-[0.06em] text-sand">
                  {rank.title}
                </p>
                <p className="mt-2 text-sm text-sand/70">{rank.subtitle ?? "Rank Package"}</p>
                <p className="mt-4 text-lg font-semibold text-ember">{formatPkr(rank.price_pkr)}</p>
                <ul className="mt-4 space-y-1 text-xs uppercase tracking-[0.12em] text-sand/75">
                  <li>Homes: {rank.homes ?? "N/A"}</li>
                  <li>Vaults: {rank.vaults ?? "N/A"}</li>
                  <li>Kit: {rank.kit_name ?? "N/A"}</li>
                </ul>
              </article>
            </Reveal>
          ))}
          {ranks.slice(1, 4).length === 0 ? (
            <p className="text-sm text-sand/70">No featured ranks published yet.</p>
          ) : null}
        </div>
      </section>

      <section className="border-y border-orange-200/10 bg-black/30">
        <div className="section-shell py-16">
          <Reveal>
            <SectionTitle
              eyebrow="Live Wire"
              title="Latest News"
              subtitle="Track wipes, events, and faction-level updates."
            />
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            {announcements.map((announcement, index) => {
              const publishedDate = announcement.published_at
                ? new Date(announcement.published_at)
                : null;
              const dateLabel = publishedDate
                ? publishedDate.toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit"
                  })
                : "Update";
              return (
                <Reveal key={announcement.id} delay={index * 0.08}>
                  <article className="metal-panel rounded-md p-5">
                    <p className="text-[0.62rem] uppercase tracking-[0.16em] text-sand/60">
                      {dateLabel}
                    </p>
                    <h3 className="mt-2 font-display text-3xl uppercase tracking-[0.06em] text-sand">
                      {announcement.title}
                    </h3>
                    <p className="mt-3 text-sm text-sand/80">{announcement.body}</p>
                  </article>
                </Reveal>
              );
            })}
            {announcements.length === 0 ? (
              <p className="text-sm text-sand/70">No announcements published yet.</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section-shell py-16">
        <Reveal>
          <SectionTitle
            eyebrow="Identity"
            title="Server Tags"
            subtitle="Rare tag styles for players who want their name to carry weight."
            action={
              <Link
                href="/tags"
                className="text-[0.65rem] uppercase tracking-[0.2em] text-ember transition hover:text-sand"
              >
                View All Tags
              </Link>
            }
          />
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {tags.map((tag, index) => (
            <Reveal key={tag.id} delay={index * 0.08}>
              <article className="metal-panel rounded-md p-5">
                <p className="text-[0.62rem] uppercase tracking-[0.16em] text-sand/60">{tag.rarity}</p>
                <h3 className="mt-1 font-display text-3xl uppercase tracking-[0.06em] text-sand">
                  {tag.name}
                </h3>
                <p className="mt-1 text-[0.66rem] uppercase tracking-[0.16em] text-ember">{tag.style}</p>
                <p className="mt-3 text-sm text-sand/80">{tag.description}</p>
              </article>
            </Reveal>
          ))}
          {tags.length === 0 ? <p className="text-sm text-sand/70">No tags published yet.</p> : null}
        </div>
      </section>
    </>
  );
}
