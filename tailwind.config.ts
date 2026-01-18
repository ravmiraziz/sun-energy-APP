import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0df2b1",
        "background-light": "#f5f8f7",
        "background-dark": "#0B1220",
        "card-dark": "#111827",
        "surface-dark": "#1a2e28",
        "border-teal": "#22493e",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
