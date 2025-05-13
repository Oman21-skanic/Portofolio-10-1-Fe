/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // Wajib pakai 'class' untuk toggle manual
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: '#f8fafc',
                text: 'var(--color-text-color)',
                primary: 'var(--color-primary)',
                accent: 'var(--color-accent)',
                card: 'var(--color-card)',
            }
        },
    },
    plugins: [],
}