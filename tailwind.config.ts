import type { Config } from "tailwindcss";

export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                portfolio: {
                    light: "#FFFFFF",
                    gray: "#8A8A93",      /* Aquele Light Gray do seu Style Guide */
                    dark: "#222225",      /* O Dark Gray do seu Style Guide */
                    black: "#000000",
                }
            },
            letterSpacing: {
                tightest: '-0.06em',    /* Isso vai deixar a fonte com estilo "Display" juntinha */
            }
        },
    },
    plugins: [],
} satisfies Config;