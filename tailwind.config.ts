import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      colors: {
        coal: "var(--coal)",
        ash: "var(--ash)",
        sand: "var(--sand)",
        ember: "var(--ember)",
        rust: "var(--rust)",
        steel: "var(--steel)",
        smoke: "var(--smoke)",
        azure: "var(--azure)",
        frost: "var(--frost)"
      },
      boxShadow: {
        inferno: "0 20px 60px rgba(177, 76, 36, 0.28)",
        steel: "0 10px 32px rgba(17, 18, 19, 0.45)"
      },
      backgroundImage: {
        "dune-gradient":
          "radial-gradient(circle at 18% 18%, rgba(230, 142, 72, 0.28), transparent 48%), radial-gradient(circle at 90% -20%, rgba(127, 49, 20, 0.36), transparent 46%), linear-gradient(180deg, #12100f 0%, #181412 40%, #0f0d0c 100%)"
      }
    }
  },
  plugins: []
};

export default config;
