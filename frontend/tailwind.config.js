/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', 'class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom color system (from globals.css)
        'primary-bg': 'rgb(var(--primary-bg) / <alpha-value>)',
        'secondary-bg': 'rgb(var(--secondary-bg) / <alpha-value>)',
        'primary-fg': 'rgb(var(--primary-fg) / <alpha-value>)',
        'secondary-fg': 'rgb(var(--secondary-fg) / <alpha-value>)',
        'text-primary': 'rgb(var(--text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--text-secondary) / <alpha-value>)',
        'text-tertiary': 'rgb(var(--text-tertiary) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-light) / <alpha-value>)'
        },
        'accent-dark': 'rgb(var(--accent-dark) / <alpha-value>)',
        'accent-darkest': 'rgb(var(--accent-darkest) / <alpha-value>)',
        'accent-light': 'rgb(var(--accent-light) / <alpha-value>)',
        'status-success': 'rgb(var(--status-success) / <alpha-value>)',
        'status-error': 'rgb(var(--status-error) / <alpha-value>)',
        'status-warning': 'rgb(var(--status-warning) / <alpha-value>)',
        'status-alert': 'rgb(var(--status-alert) / <alpha-value>)',

        // Shadcn color mappings (using closest matches from globals.css)
        primary: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)', // Maps to accent
          foreground: 'rgb(var(--primary-bg) / <alpha-value>)' // White text on primary
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary-bg) / <alpha-value>)', // Maps to secondary-bg
          foreground: 'rgb(var(--text-primary) / <alpha-value>)' // Dark text on secondary
        },
        background: 'rgb(var(--primary-bg) / <alpha-value>)', // Maps to primary-bg
        foreground: 'rgb(var(--text-primary) / <alpha-value>)', // Maps to text-primary
        card: {
          DEFAULT: 'rgb(var(--primary-bg) / <alpha-value>)', // White card
          foreground: 'rgb(var(--text-primary) / <alpha-value>)' // Dark text
        },
        popover: {
          DEFAULT: 'rgb(var(--primary-bg) / <alpha-value>)', // White popover
          foreground: 'rgb(var(--text-primary) / <alpha-value>)' // Dark text
        },
        muted: {
          DEFAULT: 'rgb(var(--secondary-bg) / <alpha-value>)', // Light gray
          foreground: 'rgb(var(--text-secondary) / <alpha-value>)' // Medium gray text
        },
        destructive: {
          DEFAULT: 'rgb(var(--status-error) / <alpha-value>)', // Maps to status-error
          foreground: 'rgb(var(--primary-bg) / <alpha-value>)' // White text
        },
        input: 'rgb(var(--border) / <alpha-value>)', // Maps to border color
        ring: 'rgb(var(--accent) / <alpha-value>)', // Maps to accent for focus rings
        chart: {
          '1': 'rgb(var(--accent) / <alpha-value>)',
          '2': 'rgb(var(--accent-light) / <alpha-value>)',
          '3': 'rgb(var(--accent-dark) / <alpha-value>)',
          '4': 'rgb(var(--status-success) / <alpha-value>)',
          '5': 'rgb(var(--status-warning) / <alpha-value>)'
        },

        // Legacy colors (keeping for backward compatibility)
        'background-light': '#F9FAFB',
        'background-dark': '#111827',
        'text-light': '#1F2937',
        'text-dark': '#F9FAFB',
        'card-light': '#FFFFFF',
        'card-dark': '#1F2937',
        'border-light': '#E5E7EB',
        'border-dark': '#374151',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif'
        ],
        heading: [
          'Outfit',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif'
        ],
        display: [
          'Outfit',
          'sans-serif'
        ]
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: 'var(--radius)',
        xl: '1rem',
        full: '9999px',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
        card: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)'
      },
      backdropBlur: {
        xl: '20px'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}
