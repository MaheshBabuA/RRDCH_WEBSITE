/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#0ea5e9', // Vibrant Sky Blue
        'secondary-blue': '#0f172a', // Deep Professional Slate
        'accent-emerald': '#10b981', // Trust Emerald
        'soft-bg': '#f8fafc', // Clean Surface
        'text-main': '#1e293b', // Readable Slate
        'text-muted': '#64748b', // Softened Contrast
        'border-soft': '#e2e8f0', // Subtle Division
        'error-red': '#ef4444',
        'success-green': '#10b981',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.1), 0 4px 10px -5px rgba(0, 0, 0, 0.04)',
        'premium-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.15), 0 10px 20px -10px rgba(0, 0, 0, 0.05)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
      }
    },
  },
  plugins: [],
}
