export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:    "#1a6b5e",
        secondary:  "#e05a2b",
        accent:     "#f5a623",
        background: "#fdf6ee",
      },
      fontFamily: {
        sans:  ['Outfit', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
      },
      boxShadow: {
        'glow-green':  '0 0 30px -5px rgba(45,79,70,0.35)',
        'glow-terra':  '0 0 30px -5px rgba(193,106,70,0.35)',
        'glow-gold':   '0 0 30px -5px rgba(232,182,125,0.4)',
        'card':        '0 4px 24px rgba(45,79,70,0.08)',
        'card-hover':  '0 12px 40px rgba(45,79,70,0.15)',
        'float':       '0 20px 60px rgba(45,79,70,0.12)',
      },
      backgroundImage: {
        'mesh-light':  'radial-gradient(at 0% 0%, hsla(17,60%,52%,0.10) 0, transparent 60%), radial-gradient(at 50% 0%, hsla(165,28%,24%,0.07) 0, transparent 60%), radial-gradient(at 100% 100%, hsla(34,68%,70%,0.10) 0, transparent 60%)',
        'mesh-dark':   'radial-gradient(at 0% 0%, hsla(165,28%,24%,0.6) 0, transparent 50%), radial-gradient(at 100% 100%, hsla(17,60%,52%,0.4) 0, transparent 50%)',
        'shimmer':     'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
      },
      animation: {
        'fade-in':       'fadeIn 0.5s ease-out both',
        'slide-up':      'slideUp 0.4s ease-out both',
        'slide-in-right':'slideInRight 0.4s ease-out both',
        'pop-in':        'popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
        'shimmer':       'shimmer 2s infinite linear',
        'float':         'float 4s ease-in-out infinite',
        'pulse-soft':    'pulseSoft 2.5s ease-in-out infinite',
        'spin-slow':     'spin 3s linear infinite',
        'wave':          'wave 1.4s ease-in-out infinite',
        'wave2':         'wave 1.4s ease-in-out 0.2s infinite',
        'wave3':         'wave 1.4s ease-in-out 0.4s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        popIn: {
          '0%':   { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%':      { transform: 'scaleY(1.2)' },
        },
      },
    },
  },
  plugins: [],
}
