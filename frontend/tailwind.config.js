/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    purple: '#8B5CF6',
                    indigo: '#6366F1',
                },
                bg: {
                    soft: '#F6F7FB',
                },
                text: {
                    main: '#0F172A',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            borderRadius: {
                'card': '14px',
            }
        },
    },
    plugins: [],
}
