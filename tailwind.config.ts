import { type Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  important: "#__next",
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
} satisfies Config;
