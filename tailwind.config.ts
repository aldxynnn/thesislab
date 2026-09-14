import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#101828",
        muted: "#667085",
        brand: "#635BFF",
        brand2: "#7C3AED",
        soft: "#F5F6FF"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(16, 24, 40, .10)"
      }
    }
  },
  plugins: []
};

export default config;