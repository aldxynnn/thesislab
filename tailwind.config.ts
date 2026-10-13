import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#243449",
        muted: "#687586",
        brand: "#315B7D",
        brand2: "#C49A55",
        soft: "#EAF0F5",
        paper: "#F7F5F0",
        forest: "#172D46",
        sage: "#EAF0F5",
        brass: "#C49A55",
      },
      boxShadow: { soft: "0 8px 24px rgba(23, 45, 70, .07)" },
    },
  },
  plugins: [],
};

export default config;
