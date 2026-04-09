module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Couleurs primaires */
        primary: "var(--color-primary)",
        "primary-dark": "var(--color-primary-dark)",
        "primary-darker": "var(--color-primary-darker)",
        
        /* Couleurs neutres claires */
        white: "var(--color-white)",
        "white-off": "var(--color-white-off)",
        "gray-50": "var(--color-gray-50)",
        "gray-100": "var(--color-gray-100)",
        "gray-150": "var(--color-gray-150)",
        "gray-200": "var(--color-gray-200)",
        "gray-300": "var(--color-gray-300)",
        "gray-400": "var(--color-gray-400)",
        "gray-light": "var(--color-gray-light)",
        
        /* Couleurs neutres foncées */
        black: "var(--color-black)",
        "black-alt": "var(--color-black-alt)",
        "black-variant": "var(--color-black-variant)",
        "dark-gray": "var(--color-dark-gray)",
        "gray-medium": "var(--color-gray-medium)",
        "gray-muted": "var(--color-gray-muted)",
        "gray-muted-light": "var(--color-gray-muted-light)",
        
        /* Couleurs statuts */
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        "error-accent": "var(--color-error-accent)",
        "error-destructive": "var(--color-error-destructive)",
        "error-dark": "var(--color-error-dark)",
        gold: "var(--color-gold)",
      },
    },
  },
  plugins: [],
}
