module.exports = {
  mode: 'jit',  // Make sure JIT mode is enabled
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure this is correct to include all your JSX/TSX files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
