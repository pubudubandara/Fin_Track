/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#4cbb7d", // soft green
          DEFAULT: "#1e7646", // main green
          dark: "#145a36", // deeper green
        },
        secondary: {
          light: "#7fd9a6", // light mint green
          DEFAULT: "#4cbb7d", // secondary green
          dark: "#2f9e63", // strong green
        },
        accent: {
          light: "#6ee7b7", // mint accent
          DEFAULT: "#34d399", // teal-green accent
          dark: "#059669", // emerald accent
        },
        success: {
          light: "#86efac", // green-300
          DEFAULT: "#22c55e", // green-500
          dark: "#15803d", // green-700
        },
        error: {
          light: "#fca5a5", // red-300
          DEFAULT: "#ef4444", // red-500
          dark: "#b91c1c", // red-700
        },
        neutral: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },
    },
  },
  plugins: [],
};
