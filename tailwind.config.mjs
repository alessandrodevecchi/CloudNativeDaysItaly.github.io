/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Brand palette — vedi docs/figma-token-mapping.md
        "brand-blue": "#3069DE",
        "brand-magenta": "#F91B71",
        "brand-yellow": "#FBC430",
        "brand-yellow-light": "#FADD64",
        ink: "#111111",
        "ink-soft": "#333333",
        "ink-muted": "#555555",
        "ink-faint": "#666666",
        cream: "#FDF6E3",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "Poppins", "sans-serif"],
        display: ["var(--font-display)", "Anton", "sans-serif"],
      },
      fontSize: {
        display: ["clamp(3rem, 7vw, 7.5rem)", { lineHeight: "1" }],
        section: ["clamp(2rem, 3.5vw, 2.875rem)", { lineHeight: "1.1" }],
        stat: ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.1" }],
        stamp: ["clamp(0.875rem, 1.5vw, 1.25rem)", { lineHeight: "1.2" }],
      },
      boxShadow: {
        pop: "4px 4px 0 0 #111111",
        "pop-sm": "3px 3px 0 0 #111111",
        "pop-lg": "6px 6px 0 0 #111111",
        "pop-white": "4px 4px 0 0 #FFFFFF",
        "pop-white-sm": "3px 3px 0 0 #FFFFFF",
      },
      borderWidth: {
        pop: "2px",
        "pop-accent": "3px",
      },
    },
  },
  plugins: [],
};
