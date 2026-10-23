import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background:
            "radial-gradient(circle at 20% 20%, rgba(212, 110, 52, 0.4), transparent 50%), linear-gradient(160deg, #120f0d 0%, #1b1612 45%, #0e0b09 100%)",
          color: "#f4dfc3"
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            opacity: 0.8
          }}
        >
          Minecraft Outlaw Server
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div
            style={{
              fontSize: 134,
              lineHeight: 0.88,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 700
            }}
          >
            Dakait MC
          </div>
          <div style={{ fontSize: 34, opacity: 0.84 }}>
            Ranks, Tags, and Bandit-Style Survival
          </div>
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
