import { PixelGallery, type PixelItem } from "@/components/sections/pixel-gallery";
import { Reveal } from "@/components/sections/reveal";
import { SectionTitle } from "@/components/sections/section-title";
import { getStaffMembers } from "@/lib/data/public";

export default async function StaffPage() {
  const staff = await getStaffMembers();
  const staffScenes: PixelItem[] = [
    {
      src: "/media/minecraft/dungeons-ultimate.png",
      title: "Command Center",
      subtitle: "Owner Controls",
      tone: "blue",
      animated: true
    },
    {
      src: "/media/minecraft/dungeons-camp-day.png",
      title: "Moderation Desk",
      subtitle: "Reports",
      tone: "white",
      animated: false
    },
    {
      src: "/media/minecraft/dungeons-flames-nether.png",
      title: "Field Ops",
      subtitle: "Active Patrol",
      tone: "red",
      animated: true
    }
  ];

  return (
    <div className="section-shell py-14">
      <Reveal>
        <SectionTitle
          eyebrow="Command Unit"
          title="Staff"
          subtitle="The crew behind moderation, updates, and faction-level balance."
        />
      </Reveal>

      <Reveal delay={0.07}>
        <PixelGallery items={staffScenes} className="mb-8 xl:grid-cols-3" />
      </Reveal>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {staff.map((member, index) => (
          <Reveal key={member.id} delay={index * 0.07}>
            <article className="metal-panel rounded-md p-5">
              <p className="text-[0.62rem] uppercase tracking-[0.16em] text-sand/60">{member.role}</p>
              <h2 className="mt-1 font-heading text-4xl uppercase tracking-[0.08em] text-sand">
                {member.ign}
              </h2>
              <p className="mt-3 text-sm text-sand/80">{member.bio || "Keeping the frontier under control."}</p>
            </article>
          </Reveal>
        ))}
        {staff.length === 0 ? <p className="text-sm text-sand/70">No staff profiles published yet.</p> : null}
      </div>
    </div>
  );
}
