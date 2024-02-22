import { type Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  important: "body",
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
} satisfies Config;
