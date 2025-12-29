/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#2badee",
                "background-light": "#f6f7f8",
                "background-dark": "#101c22",
                "secondary-dark": "#18232a", // Slightly lighter dark background for sidebar
                "surface-dark": "#283339", // For input fields, cards
                "message-incoming": "#283339",
                "message-outgoing": "#2badee",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
            borderRadius: {"DEFAULT": "0.5rem", "lg": "1rem", "xl": "1.5rem", "2xl": "1.75rem", "full": "9999px"},
        },
    },
    plugins: [],
}
