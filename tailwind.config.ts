import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#23382D",
        muted: "#6C796E",
        brand: "#176B52",
        brand2: "#D6A45D",
        soft: "#EAF1E8",
        paper: "#F6F4EE",
        forest: "#18392F",
        sage: "#EAF1E8",
        brass: "#D6A45D",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(24, 57, 47, .06)",
      },
    },
  },
  plugins: [],
};

export default config;
