import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        alumni: {
          maroon: "#A55B63",
          "maroon-dark": "#8A454C",
          "maroon-light": "#F8F0EE",
          "maroon-tint": "#F3E8E4",
          "maroon-subtle": "#F7EEEC",
          heading: "#1F2937",
          subtext: "#6B7280",
          cream: "#F6EFEA",
          border: "#E9DDD8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 25px 50px -12px rgba(165, 91, 99, 0.1), 0 0 25px 0 rgba(0, 0, 0, 0.02)",
        button: "0 10px 25px -5px rgba(165, 91, 99, 0.35)",
        "2xs": "0 1px 2px 0 rgba(0,0,0,0.05)",
        xs: "0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
