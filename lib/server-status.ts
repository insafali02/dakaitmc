export type JavaServerStatusSnapshot = {
  host: string;
  online: boolean;
  players_online: number | null;
  players_max: number | null;
  latency_ms: number | null;
  source: "mcstatus.io";
  retrieved_at: string;
  error: string | null;
};

const DEFAULT_HOST = "dakaitmc.fun";

function sanitizeAddress(input: string | null | undefined) {
  const raw = String(input || "").trim();
  if (!raw) return DEFAULT_HOST;

  const withoutProtocol = raw.replace(/^https?:\/\//i, "");
  const withoutPath = withoutProtocol.split("/")[0];
  return withoutPath || DEFAULT_HOST;
}

function numberOrNull(value: unknown) {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return value;
}

export async function fetchJavaServerStatus(address: string): Promise<JavaServerStatusSnapshot> {
  const host = sanitizeAddress(address);
  const endpoint = `https://api.mcstatus.io/v2/status/java/${encodeURIComponent(host)}?query=false&timeout=4.5`;

  try {
    const response = await fetch(endpoint, {
      cache: "no-store",
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Status API returned ${response.status}`);
    }

    const payload = (await response.json()) as {
      online?: boolean;
      players?: { online?: number; max?: number };
      latency?: number;
      retrieved_at?: number;
      expires_at?: number;
    };

    return {
      host,
      online: Boolean(payload.online),
      players_online: numberOrNull(payload.players?.online),
      players_max: numberOrNull(payload.players?.max),
      latency_ms: numberOrNull(payload.latency),
      source: "mcstatus.io",
      retrieved_at: new Date().toISOString(),
      error: null
    };
  } catch (error) {
    return {
      host,
      online: false,
      players_online: 0,
      players_max: null,
      latency_ms: null,
      source: "mcstatus.io",
      retrieved_at: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Failed to fetch server status"
    };
  }
}

