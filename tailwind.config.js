/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'fb-blue': '#1877f2',
        'fb-light-gray': '#f0f2f5',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
        'tickle-shake': {
          '0%, 100%': { transform: 'scale(1) translateY(0)' },
          '25%': { transform: 'scale(1.1) translateY(-5px)' },
          '50%': { transform: 'scale(1.2) translateY(-10px)' },
          '75%': { transform: 'scale(1.1) translateY(-5px)' },
        },
        'float-up': {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-100px) scale(0.5)' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.3s ease-in-out',
        'tickle-shake': 'tickle-shake 0.4s ease-in-out',
        'float-up': 'float-up 1s ease-out forwards',
      },
    },
  },
  plugins: [],
};
