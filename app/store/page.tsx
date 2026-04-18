import type { Metadata } from "next";
import Link from "next/link";

import { PixelGallery, type PixelItem } from "@/components/sections/pixel-gallery";
import { Reveal } from "@/components/sections/reveal";
import { SectionTitle } from "@/components/sections/section-title";
import { getSiteSettings, getStoreCategories, getStoreItems } from "@/lib/data/public";
import { resolveActionUrl, settingValue } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dakait MC Store | Crate Keys, Cash, Hearts, Elite Kits",
  description:
    "Buy Crate Keys, In-Game Money, Heart Items, and Elite Kits for Dakait MC. All Buy Now actions route to the configured Discord server."
};

export default async function StorePage() {
  const [categories, items, settings] = await Promise.all([
    getStoreCategories(),
    getStoreItems(),
    getSiteSettings()
  ]);
  const discordUrl = settingValue(settings, "discord_url", "https://discord.gg/dakaitmc");

  const storeScenes: PixelItem[] = [
    {
      src: "/media/minecraft/dungeons-camp-day.png",
      title: "Crate Keys",
      subtitle: "Fast Loot Unlocks",
      tone: "orange",
      animated: true
    },
    {
      src: "/media/minecraft/minecraft-bedrock.png",
      title: "In-Game Money",
      subtitle: "Cash Bundles",
      tone: "white",
      animated: false
    },
    {
      src: "/media/minecraft/dungeons-flames-nether.png",
      title: "Elite Kits",
      subtitle: "Premium Loadouts",
      tone: "blue",
      animated: true
    }
  ];

  return (
    <div className="section-shell py-14">
      <Reveal>
        <SectionTitle
          eyebrow="Dakait Market"
          title="Store"
          subtitle="Crate Keys, In-Game Money, Heart Items, and Elite Kits."
        />
      </Reveal>

      <Reveal delay={0.06}>
        <div className="metal-panel mb-8 grid gap-4 rounded-md p-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="font-heading text-3xl uppercase tracking-[0.1em] text-sand">Elite Kits</p>
            <p className="mt-1 text-sm text-sand/75">
              VIP KIT, ELITE KIT, IMMORTAL KIT, and OBLIX KIT are available in the same store flow.
            </p>
          </div>
          <Link
            href={discordUrl}
            className="inline-flex rounded-sm border border-ember bg-ember/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-sand transition hover:bg-ember/35"
          >
            Open Discord
          </Link>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <PixelGallery items={storeScenes} className="mb-9 xl:grid-cols-3" />
      </Reveal>

      <div className="space-y-10">
        {categories.map((category, index) => {
          const categoryItems = items.filter((item) => item.category_id === category.id);
          return (
            <Reveal key={category.id} delay={index * 0.08}>
              <section className="rounded-md border border-white/10 bg-black/25 p-5">
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="font-display text-4xl uppercase tracking-[0.06em] text-sand">
                      {category.name}
                    </h2>
                    {category.description ? (
                      <p className="mt-1 text-sm text-sand/70">{category.description}</p>
                    ) : null}
                  </div>
                  <p className="text-[0.65rem] uppercase tracking-[0.16em] text-sand/60">
                    {categoryItems.length} item{categoryItems.length === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {categoryItems.map((item) => {
                    const lines = item.description
                      ? item.description
                          .split("\n")
                          .map((line) => line.trim())
                          .filter(Boolean)
                      : [];
                    return (
                      <article key={item.id} className="metal-panel rounded-md p-5">
                        <p className="text-[0.62rem] uppercase tracking-[0.16em] text-sand/65">
                          {item.package_label || "Package"}
                        </p>
                        <h3 className="mt-2 font-display text-3xl uppercase tracking-[0.06em] text-sand">
                          {item.title}
                        </h3>
                        <p className="mt-3 text-lg font-semibold text-ember">{item.price_pkr} PKR</p>

                        {lines.length > 0 ? (
                          <ul className="mt-3 space-y-1 text-sm text-sand/80">
                            {lines.map((line) => (
                              <li key={`${item.id}-${line}`}>{line}</li>
                            ))}
                          </ul>
                        ) : null}

                        <Link
                          href={resolveActionUrl(item.cta_url, discordUrl)}
                          className="mt-5 inline-flex rounded-sm border border-ember bg-ember/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-sand shadow-[0_0_20px_rgba(236,114,50,0.2)] transition hover:bg-ember/35"
                        >
                          {item.cta_label}
                        </Link>
                      </article>
                    );
                  })}
                  {categoryItems.length === 0 ? (
                    <p className="text-sm text-sand/70">No items published in this category yet.</p>
                  ) : null}
                </div>
              </section>
            </Reveal>
          );
        })}
        {categories.length === 0 ? (
          <p className="text-sm text-sand/70">No store categories published yet.</p>
        ) : null}
      </div>
    </div>
  );
}
