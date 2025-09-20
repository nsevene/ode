/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ODE Brand Colors
        'ode-burgundy': '#8B0000',
        'ode-burgundy-light': '#A52A2A',
        'ode-mustard': '#FFC107',
        'ode-mustard-light': '#FFD700',
        'ode-charcoal': '#2C2C2C',
        'ode-cream': '#FDFCF9',
        'ode-sage': '#9CAF88',
        'ode-terracotta': '#CD853F',
        
        // Semantic colors
        border: 'hsl(220 7% 89%)',
        input: 'hsl(220 7% 89%)',
        ring: 'hsl(0 100% 27%)',
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(0 0% 3.9%)',
        primary: {
          DEFAULT: 'hsl(0 100% 27%)',
          foreground: 'hsl(0 0% 98%)',
        },
        secondary: {
          DEFAULT: 'hsl(45 100% 51%)',
          foreground: 'hsl(0 0% 9%)',
        },
        destructive: {
          DEFAULT: 'hsl(0 84.2% 60.2%)',
          foreground: 'hsl(0 0% 98%)',
        },
        muted: {
          DEFAULT: 'hsl(220 7% 96%)',
          foreground: 'hsl(218 12% 35%)',
        },
        accent: {
          DEFAULT: 'hsl(45 100% 51%)',
          foreground: 'hsl(0 0% 9%)',
        },
        popover: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(0 0% 3.9%)',
        },
        card: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(0 0% 3.9%)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(255, 193, 7, 0.4)',
        'elegant': '0 12px 48px -12px rgba(139, 0, 0, 0.3)',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #8B0000 0%, #FFC107 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FFC107 0%, #FFD700 100%)',
        'gradient-subtle': 'linear-gradient(180deg, #FDFCF9 0%, #FFFFFF 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 193, 7, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 193, 7, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}