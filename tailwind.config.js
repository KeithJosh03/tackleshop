export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './globals.css',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'site-bg': "url('/background.jpg')",
      },
      colors: {
        primary: '#ffc49a',
        secondary: '#c0c6db',
        tertiary: '#c5d1e8',
        neutral: '#101415',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
