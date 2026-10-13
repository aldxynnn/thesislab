import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#25352B",
        muted: "#69746A",
        brand: "#294B3A",
        brand2: "#B66B4B",
        soft: "#E0E8DC",
        paper: "#F5F2E9"
      },
      boxShadow: {
        soft: "0 8px 24px rgba(37, 53, 43, .06)"
      }
    }
  },
  plugins: []
};

export default config;
