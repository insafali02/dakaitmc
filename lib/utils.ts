import clsx, { type ClassValue } from "clsx";

import type { SiteSetting } from "@/lib/types";

export function cn(...values: ClassValue[]) {
  return clsx(values);
}

export function settingValue(settings: SiteSetting[], key: string, fallback = "") {
  const hit = settings.find((item) => item.key === key);
  return hit?.value_text ?? fallback;
}

export function booleanGlyph(value: boolean) {
  return value ? "\u2713" : "\u2717";
}

const badCheckGlyph = "\u00e2\u0153\u201c";
const badCrossGlyph = "\u00e2\u0153\u2014";

export function cleanGlyphText(value: string) {
  return value.replaceAll(badCheckGlyph, "\u2713").replaceAll(badCrossGlyph, "\u2717");
}

export function formatPkr(value: number | null) {
  if (value === null) return "Free";
  return `${value} PKR`;
}

export function resolveActionUrl(url: string | null | undefined, discordUrl: string) {
  if (!url || url === "#") return discordUrl;
  return url;
}
