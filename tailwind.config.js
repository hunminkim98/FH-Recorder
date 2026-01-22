/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#5B21B6",
        "primary-light": "#7C3AED",
        "background-light": "#F8FAFC",
        "background-dark": "#0F172A",
        "surface-light": "#FFFFFF",
        "surface-dark": "#1E293B",
        "border-light": "#E2E8F0",
        "border-dark": "#334155",
        "brand-navy": "#1e3a8a",
        "brand-purple": "#6366f1",
        "brand-light": "#e0e7ff",
        "surface-white": "#ffffff",
        "bg-page": "#f3f4f6",
        "pitch-blue": "#004E9C",
        "pitch-border": "#00B4D8",
        "text-main": "#1f2937",
        "text-sub": "#6b7280",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Lexend", "Noto Sans KR", "sans-serif"],
        body: ["Noto Sans KR", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.75rem",
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 0 0 1px rgba(0,0,0,0.03), 0 2px 8px rgba(0,0,0,0.04)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
  ],
}
