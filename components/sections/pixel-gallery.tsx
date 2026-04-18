import Image from "next/image";

import { cn } from "@/lib/utils";

export type PixelItem = {
  src: string;
  title: string;
  subtitle?: string;
  tone?: "red" | "blue" | "orange" | "white";
  animated?: boolean;
};

export function PixelGallery({
  items,
  className
}: {
  items: PixelItem[];
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 xl:grid-cols-3", className)}>
      {items.map((item, index) => (
        <article
          key={`${item.src}-${index}`}
          className={cn(
            "pixel-frame group relative overflow-hidden rounded-md border bg-black",
            item.tone === "red" && "pixel-tone-red",
            item.tone === "blue" && "pixel-tone-blue",
            item.tone === "orange" && "pixel-tone-orange",
            item.tone === "white" && "pixel-tone-white",
            item.animated && "pixel-float"
          )}
        >
          <Image
            src={item.src}
            alt={item.title}
            width={1024}
            height={576}
            className="h-56 w-full bg-black object-cover transition duration-500 group-hover:scale-[1.05]"
            priority={index < 2}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(8,10,20,0.9)_100%)]" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-[0.62rem] uppercase tracking-[0.18em] text-white/70">Server Capture</p>
            <p className="font-heading text-2xl uppercase tracking-[0.08em] text-white">{item.title}</p>
            {item.subtitle ? (
              <p className="text-[0.7rem] uppercase tracking-[0.12em] text-white/70">{item.subtitle}</p>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
