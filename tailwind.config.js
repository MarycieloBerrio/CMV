/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'valladolid': {
          primary: '#434c4e',    // Dark gray for text
          secondary: '#bec8c8',  // Light gray for input focus
          accent: '#fe4c00',     // Orange for focus states
          light: '#eef0f2',      // Light gray for background
          dark: '#434c4e',       // Dark gray for text
          success: '#84bd00',    // Green for approved status
          warning: '#f4a700',    // Yellow for pending status
          error: '#e6332a',      // Red for rejected status
        }
      },
      fontFamily: {
        'archivo': ['Archivo', 'sans-serif'],
        'karla': ['Karla', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',    // 12px
        'sm': '0.875rem',   // 14px
        'base': '1rem',     // 16px
        'lg': '1.125rem',   // 18px
        'xl': '1.25rem',    // 20px
        '2xl': '1.5rem',    // 24px
        '3xl': '1.875rem',  // 30px
        '4xl': '2.25rem',   // 36px
        '5xl': '2.5rem',    // 40px
      },
      maxWidth: {
        '1200': '1200px',
      },
      spacing: {
        '1': '0.25rem',     // 4px
        '2': '0.5rem',      // 8px
        '3': '0.75rem',     // 12px
        '4': '1rem',        // 16px
        '5': '1.25rem',     // 20px
        '6': '1.5rem',      // 24px
        '8': '2rem',        // 32px
        '10': '2.5rem',     // 40px
        '12': '3rem',       // 48px
        '16': '4rem',       // 64px
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',   // 2px
        'DEFAULT': '0.25rem', // 4px
        'md': '0.375rem',   // 6px
        'lg': '0.5rem',     // 8px
        'xl': '0.75rem',    // 12px
        '2xl': '1rem',      // 16px
        'full': '9999px',
        '14': '14px',       // For status badges
      },
    },
  },
  plugins: [],
}
