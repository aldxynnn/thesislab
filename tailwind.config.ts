import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#242D37",
        muted: "#6D7278",
        brand: "#1C4066",
        brand2: "#D6A45D",
        soft: "#E9ECF0",
        paper: "#F7F5F0",
        forest: "#1A2837",
        sage: "#E9ECF0",
        brass: "#D6A45D",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(26, 40, 55, .07)",
      },
    },
  },
  plugins: [],
};

export default config;
