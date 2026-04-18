import { PixelGallery, type PixelItem } from "@/components/sections/pixel-gallery";
import { Reveal } from "@/components/sections/reveal";
import { SectionTitle } from "@/components/sections/section-title";
import { getFaqs } from "@/lib/data/public";

export default async function FaqPage() {
  const faqs = await getFaqs();
  const faqScenes: PixelItem[] = [
    {
      src: "/media/minecraft/dungeons-echoing-void.png",
      title: "Entry Questions",
      subtitle: "Join Guide",
      tone: "blue",
      animated: true
    },
    {
      src: "/media/minecraft/dungeons-camp-day.png",
      title: "Store Questions",
      subtitle: "Buying Flow",
      tone: "orange",
      animated: false
    },
    {
      src: "/media/minecraft/dungeons-hidden-depths.png",
      title: "Gameplay Questions",
      subtitle: "Progression",
      tone: "white",
      animated: true
    }
  ];

  return (
    <div className="section-shell py-14">
      <Reveal>
        <SectionTitle
          eyebrow="Quick Intel"
          title="FAQ"
          subtitle="Answers for joining, buying, and progressing through Dakait MC."
        />
      </Reveal>

      <Reveal delay={0.07}>
        <PixelGallery items={faqScenes} className="mb-8 xl:grid-cols-3" />
      </Reveal>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Reveal key={faq.id} delay={index * 0.07}>
            <details className="metal-panel rounded-md p-5" open={index === 0}>
              <summary className="cursor-pointer list-none font-heading text-3xl uppercase tracking-[0.08em] text-sand">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm text-sand/80">{faq.answer}</p>
            </details>
          </Reveal>
        ))}
        {faqs.length === 0 ? <p className="text-sm text-sand/70">No FAQs published yet.</p> : null}
      </div>
    </div>
  );
}
