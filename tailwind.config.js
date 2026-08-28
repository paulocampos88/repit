/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: '#B24BF3',
        accent2: '#22D3EE',
        loop: '#39FF88',
        danger: '#FF4D6D',
        ink: '#06060B',
        surface: '#12121C',
        'surface-2': '#191927',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 18px rgba(178,75,243,0.55), 0 0 42px rgba(178,75,243,0.22)',
        'neon-sm': '0 0 10px rgba(178,75,243,0.5)',
        'neon-cyan': '0 0 18px rgba(34,211,238,0.5)',
        'neon-loop': '0 0 18px rgba(57,255,136,0.5), 0 0 36px rgba(57,255,136,0.2)',
      },
      dropShadow: {
        neon: '0 0 10px rgba(178,75,243,0.85)',
        'neon-cyan': '0 0 10px rgba(34,211,238,0.85)',
        'neon-loop': '0 0 10px rgba(57,255,136,0.85)',
      },
    },
  },
  plugins: [],
}
