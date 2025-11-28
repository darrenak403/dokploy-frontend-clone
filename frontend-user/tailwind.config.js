/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // single component styles
    "./node_modules/@heroui/theme/dist/components/button.js",
    // or you can use a glob pattern (multiple component styles)
    "./node_modules/@heroui/theme/dist/components/(button|snippet|code|input).js",
  ],
  darkMode: "class", // Enable dark mode via class strategy
  theme: {
    extend: {
      colors: {
        // Custom color palette that works well with dark/light themes
        primary: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#e31937",
          600: "#c4162f",
          700: "#a01329",
          800: "#7d0f23",
          900: "#590b1d",
        },
        // Background colors
        background: {
          light: "#ffffff",
          dark: "#0f0f23",
        },
        // Text colors
        foreground: {
          light: "#1f2937",
          dark: "#f9fafb",
        },
        // Card colors
        card: {
          light: "#ffffff",
          dark: "#1f1f3a",
        },
        // Border colors
        border: {
          light: "#e5e7eb",
          dark: "#374151",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [heroui()],
};
