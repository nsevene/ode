import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Palette colors from uploaded design
        'pure-white': 'hsl(var(--pure-white))',
        'cream-light': 'hsl(var(--cream-light))',
        'cream-medium': 'hsl(var(--cream-medium))',
        'sand-background': 'hsl(var(--sand-background))',
        'sage-blue': 'hsl(var(--sage-blue))',
        'dusty-rose': 'hsl(var(--dusty-rose))',
        terracotta: 'hsl(var(--terracotta))',
        burgundy: 'hsl(var(--burgundy))',
        'burgundy-primary': 'hsl(var(--burgundy-primary))',
        'burgundy-light': 'hsl(var(--burgundy-light))',
        'mustard-accent': 'hsl(var(--mustard-accent))',
        'mustard-light': 'hsl(var(--mustard-light))',
        'forest-green': 'hsl(var(--forest-green))',
        'deep-green': 'hsl(var(--deep-green))',
        'teal-dark': 'hsl(var(--teal-dark))',
        charcoal: 'hsl(var(--charcoal))',
        'charcoal-dark': 'hsl(var(--charcoal-dark))',
        'earth-warm': 'hsl(var(--earth-warm))',
        'gold-light': 'hsl(var(--gold-light))',
        'gold-accent': 'hsl(var(--gold-accent))',
        'gold-dark': 'hsl(var(--gold-dark))',
        'clay-brown': 'hsl(var(--clay-brown))',

        // Semantic colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover: 'hsl(var(--primary-hover))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        serif: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        medium: 'var(--shadow-medium)',
        strong: 'var(--shadow-strong)',
        glow: 'var(--shadow-glow)',
        elegant: 'var(--shadow-elegant)',
        burgundy: 'var(--shadow-burgundy)',
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-accent': 'var(--gradient-accent)',
        'gradient-subtle': 'var(--gradient-subtle)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0', opacity: '0' },
          to: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
            opacity: '1',
          },
          to: { height: '0', opacity: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(10px)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'scale-out': {
          from: { transform: 'scale(1)', opacity: '1' },
          to: { transform: 'scale(0.95)', opacity: '0' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(var(--primary), 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(var(--primary), 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'scale-out': 'scale-out 0.2s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.3s ease-out',
        float: 'float 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite linear',
        enter: 'fade-in 0.3s ease-out, scale-in 0.2s ease-out',
        exit: 'fade-out 0.3s ease-out, scale-out 0.2s ease-out',
      },
    },
    // Add utility classes for enhanced UX
    backgroundSize: {
      '200%': '200% 100%',
    },
    scale: {
      '102': '1.02',
      '105': '1.05',
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
