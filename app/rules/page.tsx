import { PixelGallery, type PixelItem } from "@/components/sections/pixel-gallery";
import { Reveal } from "@/components/sections/reveal";
import { SectionTitle } from "@/components/sections/section-title";
import { getRules } from "@/lib/data/public";

export default async function RulesPage() {
  const rules = await getRules();
  const ruleScenes: PixelItem[] = [
    {
      src: "/media/minecraft/dungeons-howling-peaks.png",
      title: "Combat Law",
      subtitle: "Raid Conduct",
      tone: "red",
      animated: true
    },
    {
      src: "/media/minecraft/dungeons-main.png",
      title: "Town Protocol",
      subtitle: "Spawn Rules",
      tone: "blue",
      animated: false
    },
    {
      src: "/media/minecraft/dungeons-jungle-awakens.png",
      title: "Punishment Board",
      subtitle: "Infractions",
      tone: "orange",
      animated: true
    }
  ];

  return (
    <div className="section-shell py-14">
      <Reveal>
        <SectionTitle
          eyebrow="Code of the Wasteland"
          title="Rules"
          subtitle="Fair play, hard consequences, and clear standards for every outlaw."
        />
      </Reveal>

      <Reveal delay={0.07}>
        <PixelGallery items={ruleScenes} className="mb-8 xl:grid-cols-3" />
      </Reveal>

      <div className="space-y-4">
        {rules.map((rule, index) => (
          <Reveal key={rule.id} delay={index * 0.07}>
            <article className="metal-panel rounded-md p-5">
              <p className="text-[0.62rem] uppercase tracking-[0.16em] text-sand/60">Server Law #{index + 1}</p>
              <h2 className="mt-1 font-heading text-3xl uppercase tracking-[0.08em] text-sand">
                {rule.title}
              </h2>
              <p className="mt-2 text-sm text-sand/80">{rule.body}</p>
            </article>
          </Reveal>
        ))}
        {rules.length === 0 ? <p className="text-sm text-sand/70">No rules published yet.</p> : null}
      </div>
    </div>
  );
}
