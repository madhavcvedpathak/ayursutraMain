/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                forum: ['Forum', 'cursive'],
                sans: ['Open Sans', 'sans-serif'],
                serif: ['Cormorant Garamond', 'serif'],
            },
            colors: {
                brand: {
                    deep: '#2c3e2d', // Derived from text-main
                    teal: '#5c7c51', // Derived from primary
                    ocean: '#4a6640', // Derived from primary-dark
                    muted: '#5f6f60', // Derived from text-light
                    sage: '#e8f5e9', // Light green
                    cream: '#f9f7f2', // Off-white
                }
            },
            boxShadow: {
                'brand': '0 4px 6px -1px rgba(92, 124, 81, 0.4)',
                'card': '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
            }
        },
    },
    plugins: [],
}
