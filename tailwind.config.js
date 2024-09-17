/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        zoomIn: {
          '0%': {
            opacity: 0,
            transform: 'scale3d(0.3, 0.3, 0.3)',
          },
          '80%': {
            opacity: 0.8,
            transform: 'scale3d(1.1, 1.1, 1.1)',
          },
          '100%': {
            opacity: 1,
            transform: 'scale3d(1, 1, 1)',
          },
        },
      },
      animation: {
        'zoom-in': 'zoomIn 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
};
