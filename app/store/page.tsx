import type { Metadata } from "next";

import { Reveal } from "@/components/sections/reveal";
import { SectionTitle } from "@/components/sections/section-title";
import { StoreShowcase } from "@/components/store/store-showcase";
import { getSiteSettings, getStoreCategories, getStoreItems } from "@/lib/data/public";
import { settingValue } from "@/lib/utils";

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

  return (
    <div className="section-shell section-shell-store py-14">
      <Reveal>
        <SectionTitle
          eyebrow="Dakait Market"
          title="Store"
          subtitle="Full-width storefront with bigger cards, cleaner spacing, and editable product images from admin."
        />
      </Reveal>

      <Reveal delay={0.06}>
        <StoreShowcase categories={categories} items={items} discordUrl={discordUrl} />
      </Reveal>
    </div>
  );
}
