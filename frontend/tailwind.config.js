module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6366f1', // Indigo-500
        secondary: '#10b981', // Emerald-500
        accent: '#a21caf', // Fuchsia-700
        info: '#06b6d4', // Cyan-500
        warning: '#f59e42', // Orange-400
        success: '#22c55e', // Green-500
        danger: '#ef4444', // Red-500
        background: '#f8fafc', // Light background
        card: '#fff',
        dark: '#18181b',
      },
      fontFamily: {
        display: ['Merriweather', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
