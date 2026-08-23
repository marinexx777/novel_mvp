import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#171717",
        paper: "#fbfbf8",
        line: "#dedbd2",
        ember: "#a83f39",
        pine: "#2f5d50",
        brass: "#b1843f"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"]
      },
      boxShadow: {
        cover: "0 16px 32px rgba(23, 23, 23, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
