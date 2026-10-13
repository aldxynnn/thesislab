import type { Config } from "tailwindcss";
const config: Config = {
 content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
 theme: { extend: { colors: { ink: "#15233B", muted: "#667085", brand: "#1F4FD1", brand2: "#E5A14A", soft: "#EAF0FF", paper: "#F3F5F8" }, boxShadow: { soft: "0 8px 24px rgba(21, 35, 59, .06)" } } },
 plugins: []
};
export default config;
