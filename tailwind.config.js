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
    },
  },
  plugins: [],
};
