/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        tile: {
          empty: 'hsl(216, 12.2%, 83.9%)',
          2: 'hsl(214, 94.6%, 92.7%)',
          4: 'hsl(213, 96.9%, 87.3%)',
          8: 'hsl(141, 78.9%, 85.1%)',
          16: 'hsl(142, 76.6%, 73.1%)',
          32: 'hsl(53, 98.3%, 76.9%)',
          64: 'hsl(50, 97.8%, 63.5%)',
          128: 'hsl(32, 97.7%, 83.1%)',
          256: 'hsl(31, 97.2%, 72.4%)',
          512: 'hsl(0, 96.3%, 89.4%)',
          1024: 'hsl(0, 93.5%, 81.8%)',
          2048: 'hsl(269, 97.4%, 85.1%)',
        },
      },
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
  safelist: [
    {
      pattern: /bg-tile-(empty|2|4|8|16|32|64|128|256|512|1024|2048)/,
    },
  ],
  plugins: [],
};
