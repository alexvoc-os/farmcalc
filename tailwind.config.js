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
        'primary': {
          50: '#f0f7f2',
          100: '#d9ebe0',
          200: '#b3d7c1',
          300: '#7ab896',
          400: '#4d9d72',
          500: '#1a472a',
          600: '#153d22',
          700: '#10311a',
          800: '#0c2513',
          900: '#071a0d',
        },
        'accent': {
          50: '#faf8f3',
          100: '#f5f0e8',
          200: '#ebe0cc',
          300: '#ddc89e',
          400: '#c9a84c',
          500: '#b08a2e',
          600: '#8f6e25',
          700: '#6d541d',
          800: '#4c3b14',
          900: '#2b230c',
        },
        'background': '#f8f7f4',
      }
    },
  },
  plugins: [],
}
