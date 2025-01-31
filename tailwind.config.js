/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    {
      pattern: /^bg-(indigo|blue|green|red|purple|pink|orange|gray|yellow|sky|lime|cyan|fuchsia|slate)-(50|100|500|600|700)$/,
    },
    {
      pattern: /^text-(indigo|blue|green|red|purple|pink|orange|gray|yellow|sky|lime|cyan|fuchsia|slate)-(600|700|800)$/,
    },
    {
      pattern: /^ring-(indigo|blue|green|red|purple|pink|orange|gray|yellow|sky|lime|cyan|fuchsia|slate)-(400|500)$/,
    }
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            // Base styles (mobile first)
            h1: {
              fontSize: '1.875rem', // 30px
              fontWeight: '800',
              color: '#1a1a1a',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '0.375rem',
              marginBottom: '1rem',
              '@screen sm': {
                fontSize: '2.25rem', // 36px
                paddingBottom: '0.5rem',
                marginBottom: '1.25rem'
              },
              '@screen md': {
                fontSize: '2.5rem', // 40px
                marginBottom: '1.5rem'
              }
            },
            h2: {
              fontSize: '1.5rem', // 24px
              fontWeight: '700',
              color: '#374151',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
              '@screen sm': {
                fontSize: '1.75rem', // 28px
                marginTop: '1.75rem',
                marginBottom: '0.875rem'
              },
              '@screen md': {
                fontSize: '2rem', // 32px
                marginTop: '2rem',
                marginBottom: '1rem'
              }
            },
            h3: {
              fontSize: '1.25rem', // 20px
              fontWeight: '600',
              color: '#4b5563',
              marginTop: '1.25rem',
              marginBottom: '0.5rem',
              '@screen sm': {
                fontSize: '1.375rem', // 22px
                marginTop: '1.375rem',
                marginBottom: '0.625rem'
              },
              '@screen md': {
                fontSize: '1.5rem', // 24px
                marginTop: '1.5rem',
                marginBottom: '0.75rem'
              }
            },
            h4: {
              fontSize: '1.125rem', // 18px
              fontWeight: '600',
              color: '#6b7280',
              marginTop: '1rem',
              marginBottom: '0.375rem',
              '@screen sm': {
                fontSize: '1.25rem', // 20px
                marginTop: '1.125rem',
                marginBottom: '0.5rem'
              }
            },
            h5: {
              fontSize: '1rem', // 16px
              fontWeight: '500',
              color: '#6b7280',
              marginTop: '0.875rem',
              marginBottom: '0.375rem',
              '@screen sm': {
                fontSize: '1.125rem', // 18px
                marginTop: '1rem',
                marginBottom: '0.5rem'
              }
            },
            h6: {
              fontSize: '1rem',
              fontWeight: '500',
              color: '#6b7280',
              marginTop: '0.875rem',
              marginBottom: '0.375rem'
            }
          }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
