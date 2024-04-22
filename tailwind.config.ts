import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        normal: 'var(--normal)',
        strong: 'var(--strong)',
        light: 'var(--light)',
        dark: 'var(--dark)',
        warning: {
          DEFAULT: '#CB9509',
          light: '#FFFBEB',
          border: 'rgba(253, 230, 138, 0.88)',
        },
        danger: {
          DEFAULT: '#F6455F',
          light: '#FFF1F2',
          border: 'rgba(254, 205, 211, 0.88)',
        },
        note: {
          DEFAULT: '#08ABC3',
          light: '#ECFEFF',
          border: 'rgba(165, 243, 252, 0.88)',
        },
        check: {
          DEFAULT: '#08AF72',
          light: '#ECFDF5',
          border: 'rgba(167, 243, 208, 0.88)',
        },
        info: {
          DEFAULT: 'var(--strong)',
          light: '#FAFAFA',
          border: 'rgba(212, 212, 216, 0.56)',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans), Inter, Roboto, sans-serif'],
        mono: ['var(--font-geist-mono)'],
      },
      fontSize: {
        xs: '0.8125rem',
      },
      spacing: {
        header: '96px',
        'site-nav': '56px',
        'pages-nav': '40px',
        sidebar: `calc(100vh - 56px - 40px)`,
      },
      borderRadius: {
        round: '99px',
      },
      letterSpacing: {
        default: '-0.26px',
        'tighter-1': '-0.3px',
        'tighter-3': '-0.52px',
      },
      boxShadow: {
        soft: '0px 1px 2px 0px rgba(9, 9, 11, 0.04)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
