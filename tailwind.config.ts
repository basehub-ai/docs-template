import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "var(--brand-color)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans), Inter, Roboto, sans-serif"],
        mono: ["var(--font-geist-mono)"],
      },
      spacing: {
        header: "96px",
        "site-nav": "56px",
        "pages-nav": "40px",
        sidebar: `calc(100vh - 56px - 40px)`,
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
