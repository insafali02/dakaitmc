import Link from "next/link";

import { PixelGallery, type PixelItem } from "@/components/sections/pixel-gallery";
import { Reveal } from "@/components/sections/reveal";
import { SectionTitle } from "@/components/sections/section-title";
import { getSiteSettings, getTags } from "@/lib/data/public";
import { settingValue } from "@/lib/utils";

export default async function TagsPage() {
  const [tags, settings] = await Promise.all([getTags(), getSiteSettings()]);
  const storeUrl = settingValue(settings, "store_url", "/store");
  const tagScenes: PixelItem[] = [
    {
      src: "/media/minecraft/dungeons-luminous-night.png",
      title: "Identity Matrix",
      subtitle: "Tag Styles",
      tone: "white",
      animated: true
    },
    {
      src: "/media/minecraft/dungeons-hidden-depths.png",
      title: "Aura Gateway",
      subtitle: "Legend Tags",
      tone: "blue",
      animated: true
    },
    {
      src: "/media/minecraft/minecraft-nether-update.png",
      title: "Name Glow",
      subtitle: "Rare Prefixes",
      tone: "red",
      animated: false
    }
  ];

  return (
    <div className="section-shell py-14">
      <Reveal>
        <SectionTitle
          eyebrow="Identity Layer"
          title="Tags"
          subtitle="Style your name with rare outlaw signatures and make your presence feared."
        />
      </Reveal>

      <Reveal delay={0.06}>
        <PixelGallery items={tagScenes} className="mb-8 xl:grid-cols-3" />
      </Reveal>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tags.map((tag, index) => (
          <Reveal key={tag.id} delay={index * 0.07}>
            <article className="metal-panel rounded-md p-5">
              <p className="text-[0.62rem] uppercase tracking-[0.17em] text-sand/60">{tag.rarity}</p>
              <h2 className="mt-1 font-heading text-4xl uppercase tracking-[0.08em] text-sand">
                {tag.name}
              </h2>
              <p className="mt-1 text-[0.65rem] uppercase tracking-[0.16em] text-ember">{tag.style}</p>
              <p className="mt-4 text-sm text-sand/80">{tag.description}</p>
              <div className="mt-5 flex items-center justify-between">
                <p className="text-lg font-semibold text-ember">
                  {tag.price_pkr ? `${tag.price_pkr} PKR` : "Free"}
                </p>
                <Link
                  href={tag.cta_url || storeUrl}
                  className="rounded-sm border border-ember bg-ember/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-sand shadow-[0_0_20px_rgba(236,114,50,0.2)] transition hover:bg-ember/35"
                >
                  {tag.cta_label}
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
        {tags.length === 0 ? <p className="text-sm text-sand/70">No tags published yet.</p> : null}
      </div>
    </div>
  );
}
