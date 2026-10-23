"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { DiscordTicketGateLink } from "@/components/common/discord-ticket-gate-link";
import type { StoreCategory, StoreItem } from "@/lib/types";
import { resolveActionUrl, resolveImageSrc } from "@/lib/utils";

type StoreShowcaseProps = {
  categories: StoreCategory[];
  items: StoreItem[];
  discordUrl: string;
};

type CategoryVisual = {
  fallbackImages: string[];
};

const categoryVisualsBySlug: Record<string, CategoryVisual> = {
  "crate-keys": {
    fallbackImages: [
      "/media/minecraft/dungeons-hidden-depths.png",
      "/media/minecraft/dungeons-camp-day.png",
      "/media/minecraft/dungeons-main.png",
      "/media/minecraft/dungeons-jungle-awakens.png"
    ]
  },
  "in-game-money": {
    fallbackImages: [
      "/media/minecraft/minecraft-bedrock.png",
      "/media/minecraft/minecraft-nether-update.png",
      "/media/minecraft/dungeons-howling-peaks.png"
    ]
  },
  "heart-items": {
    fallbackImages: [
      "/media/minecraft/dungeons-luminous-night.png",
      "/media/minecraft/dungeons-echoing-void.png",
      "/media/minecraft/dungeons-jungle-awakens.png"
    ]
  },
  "elite-kits": {
    fallbackImages: [
      "/media/minecraft/dungeons-ultimate.png",
      "/media/minecraft/dungeons-flames-nether.png",
      "/media/minecraft/dungeons-main.png"
    ]
  }
};

const fallbackVisualPool = [
  "/media/minecraft/dungeons-main.png",
  "/media/minecraft/dungeons-howling-peaks.png",
  "/media/minecraft/minecraft-nether-update.png"
];

function visualsForCategory(category: StoreCategory, index: number) {
  const bySlug = categoryVisualsBySlug[category.slug];
  if (bySlug) return bySlug;
  return {
    fallbackImages: [
      fallbackVisualPool[index % fallbackVisualPool.length],
      fallbackVisualPool[(index + 1) % fallbackVisualPool.length]
    ]
  };
}

function discountPercent(index: number) {
  const presets = [30, 40, 50];
  return presets[index % presets.length];
}

function comparePrice(price: number, offPercent: number) {
  const uplift = 1 + offPercent / 100;
  return Math.round(price * uplift);
}

function imageForItem(
  item: StoreItem,
  category: StoreCategory,
  categoryIndex: number,
  itemIndex: number
) {
  if (item.image_path) {
    const resolved = resolveImageSrc(item.image_path);
    const version = item.updated_at ? encodeURIComponent(item.updated_at) : "";
    return version ? `${resolved}${resolved.includes("?") ? "&" : "?"}v=${version}` : resolved;
  }

  const title = item.title.toUpperCase();
  if (title.includes("OBLIX")) return "/media/minecraft/dungeons-ultimate.png";
  if (title.includes("MATRIX")) return "/media/minecraft/dungeons-echoing-void.png";
  if (title.includes("ELITE")) return "/media/minecraft/dungeons-main.png";
  if (title.includes("PARTY")) return "/media/minecraft/dungeons-camp-day.png";
  if (title.includes("IMMORTAL")) return "/media/minecraft/dungeons-flames-nether.png";
  if (title.includes("HEART")) return "/media/minecraft/dungeons-luminous-night.png";
  if (title.includes("CASH")) return "/media/minecraft/minecraft-bedrock.png";

  const visuals = visualsForCategory(category, categoryIndex);
  return visuals.fallbackImages[itemIndex % visuals.fallbackImages.length];
}

export function StoreShowcase({ categories, items, discordUrl }: StoreShowcaseProps) {
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id || "");

  useEffect(() => {
    if (!categories.length) return;
    if (!categories.find((category) => category.id === activeCategoryId)) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId]);

  const activeCategory = useMemo(() => {
    return categories.find((category) => category.id === activeCategoryId) || categories[0] || null;
  }, [categories, activeCategoryId]);

  const activeItems = useMemo(() => {
    if (!activeCategory) return [];
    return items.filter((item) => item.category_id === activeCategory.id);
  }, [items, activeCategory]);

  if (!categories.length) {
    return (
      <section className="store-redesign-shell">
        <p className="text-sm text-sand/75">No store categories published yet.</p>
      </section>
    );
  }

  return (
    <section className="store-redesign-shell">
      <div className="store-redesign-grid">
        <aside className="store-redesign-sidebar">
          <p className="store-redesign-side-eyebrow">Store Zones</p>
          <h3 className="store-redesign-side-title">Categories</h3>
          <div className="store-redesign-tabs">
            {categories.map((category) => {
              const categoryItemsCount = items.filter((item) => item.category_id === category.id).length;
              const active = category.id === activeCategory?.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategoryId(category.id)}
                  className={`store-redesign-tab ${active ? "store-redesign-tab-active" : ""}`}
                >
                  <p className="store-redesign-tab-title">{category.name}</p>
                  <p className="store-redesign-tab-subtitle">
                    {category.description || "Expand your collection"}
                  </p>
                  <span className="store-redesign-tab-meta">{categoryItemsCount} items live</span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="store-redesign-main">
          <div className="store-redesign-main-head">
            <div>
              <p className="store-redesign-main-eyebrow">Featured Category</p>
              <h2 className="store-redesign-main-title">{activeCategory?.name || "Store"}</h2>
              <p className="store-redesign-main-copy">
                {activeCategory?.description || "Choose a package and purchase directly through Discord."}
              </p>
            </div>
            <Link href={discordUrl} className="store-redesign-discord-btn">
              Open Discord
            </Link>
          </div>

          <div className="store-redesign-cards">
            {activeItems.map((item, index) => {
              const off = discountPercent(index);
              const old = comparePrice(item.price_pkr, off);
              const categoryIndex = categories.findIndex((category) => category.id === activeCategory!.id);
              const imageSrc = imageForItem(item, activeCategory!, categoryIndex, index);
              const lines = item.description
                ? item.description
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                : [];

              return (
                <article
                  key={item.id}
                  className="store-redesign-card"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="store-redesign-media">
                    <img
                      src={imageSrc}
                      alt={item.title}
                      loading="lazy"
                      className="store-redesign-image object-cover object-center"
                    />
                    <div className="store-redesign-media-overlay" />
                    <span className="store-redesign-discount">{off}% OFF</span>
                    <div className="store-redesign-media-text">
                      <p className="store-redesign-package">{item.package_label || activeCategory?.name}</p>
                      <h3 className="store-redesign-card-title">{item.title}</h3>
                    </div>
                  </div>

                  <div className="store-redesign-body">
                    <p className="store-redesign-desc">{lines[0] || "Grab yours now"}</p>
                    <div className="store-redesign-footer">
                      <div>
                        <p className="store-redesign-old-price">{old} PKR</p>
                        <p className="store-redesign-new-price">{item.price_pkr} PKR</p>
                      </div>
                      <DiscordTicketGateLink
                        href={resolveActionUrl(item.cta_url, discordUrl)}
                        label={item.cta_label || "Buy Now"}
                        gate={/buy\s*now/i.test(item.cta_label || "Buy Now")}
                        className="store-redesign-buy-btn"
                      />
                    </div>
                  </div>
                </article>
              );
            })}
            {!activeItems.length ? (
              <p className="text-sm text-sand/70">No items published in this category yet.</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
