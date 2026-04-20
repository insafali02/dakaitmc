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
  return value
    .replaceAll(badCheckGlyph, "\u2713")
    .replaceAll(badCrossGlyph, "\u2717")
    .replace(/\\u2713/gi, "\u2713")
    .replace(/\\u2717/gi, "\u2717")
    .replace(/\bu2713\b/gi, "\u2713")
    .replace(/\bu2717\b/gi, "\u2717");
}

export function formatPkr(value: number | null) {
  if (value === null) return "Free";
  return `${value} PKR`;
}

export function resolveActionUrl(url: string | null | undefined, discordUrl: string) {
  if (!url || url === "#") return discordUrl;
  return url;
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function resolveImageSrc(
  src: string | null | undefined,
  fallback = "/media/minecraft/dungeons-main.png"
) {
  if (!src) return fallback;

  const normalized = src.trim().replace(/\\/g, "/");
  if (!normalized) return fallback;

  if (/^https?:\/\//i.test(normalized)) return normalized;
  if (normalized.startsWith("/")) return normalized;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    const base = trimTrailingSlash(supabaseUrl);
    const cleanPath = normalized.replace(/^\/+/, "");

    if (cleanPath.startsWith("storage/v1/object/public/")) {
      return `${base}/${cleanPath}`;
    }

    return `${base}/storage/v1/object/public/media/${cleanPath}`;
  }

  return `/${normalized.replace(/^\/+/, "")}`;
}
