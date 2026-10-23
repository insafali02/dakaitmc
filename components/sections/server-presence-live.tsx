"use client";

import { useEffect, useMemo, useState } from "react";

import type { JavaServerStatusSnapshot } from "@/lib/server-status";

type ServerPresenceLiveProps = {
  initialStatus: JavaServerStatusSnapshot;
};

const REFRESH_INTERVAL_MS = 10_000;

function playerLabel(status: JavaServerStatusSnapshot) {
  const online = status.players_online ?? 0;
  if (status.players_max !== null && status.players_max !== undefined) {
    return `${online}/${status.players_max}`;
  }
  return String(online);
}

export function ServerPresenceLive({ initialStatus }: ServerPresenceLiveProps) {
  const [status, setStatus] = useState<JavaServerStatusSnapshot>(initialStatus);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  useEffect(() => {
    let disposed = false;

    async function refresh() {
      const response = await fetch("/api/server-status", {
        cache: "no-store"
      });
      if (!response.ok) return;

      const payload = (await response.json()) as JavaServerStatusSnapshot;
      if (!disposed) setStatus(payload);
    }

    refresh();
    const timer = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => {
      disposed = true;
      clearInterval(timer);
    };
  }, []);

  const statusToneClass = useMemo(
    () => (status.online ? "text-emerald-300" : "text-rose-300"),
    [status.online]
  );
  const statusDotClass = useMemo(
    () => (status.online ? "bg-emerald-400 animate-pulse" : "bg-rose-400"),
    [status.online]
  );

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-sm border border-amber-200/10 bg-black/20 p-3">
        <dt className="text-[0.6rem] uppercase tracking-[0.14em] text-sand/55">Status</dt>
        <dd className={`mt-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] ${statusToneClass}`}>
          <span className={`size-2 rounded-full ${statusDotClass}`} />
          {`Status: ${status.online ? "Online" : "Offline"}`}
        </dd>
      </div>

      <div className="rounded-sm border border-amber-200/10 bg-black/20 p-3">
        <dt className="text-[0.6rem] uppercase tracking-[0.14em] text-sand/55">Players Online</dt>
        <dd className="mt-2 text-lg font-semibold text-amber-200">{playerLabel(status)}</dd>
      </div>
    </div>
  );
}
