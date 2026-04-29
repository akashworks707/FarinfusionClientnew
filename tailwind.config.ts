/** @type {import('tailwindcss').Config} */

import typography from "@tailwindcss/typography";

const config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {},
        container: {
            center: true,
            padding: "1rem",
            screens: {
                sm: "640px",
                md: "768px",
                lg: "1024px",
                xl: "1200px",
                "2xl": "1400px",
            },
        }
    },
    plugins: [
        typography,
    ],
};

export default config;