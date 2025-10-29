// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontSize: "1.75rem",
              fontWeight: "700",
              marginBottom: "1rem",
            },
            h2: { fontSize: "1.5rem", fontWeight: "600", marginTop: "1.5rem" },
            ul: { listStyleType: "disc", marginLeft: "1.5rem" },
            ol: { listStyleType: "decimal", marginLeft: "1.5rem" },
            a: {
              color: "#1e40af", // blue-800
              textDecoration: "underline",
              "&:hover": { color: "#1d4ed8" }, // blue-700
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
