export default defineAppConfig({
  // https://ui.nuxt.com/getting-started/theme#design-system
  ui: {
    // Configuration des couleurs personnalisées
    colors: {
      // Couleurs principales
      primary: 'emerald',
      neutral: 'slate',
      accent: 'rose',
      
      // Couleurs pour les disciplines d'athlétisme
      running: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
        950: '#082f49',
      },
      jumping: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7e22ce',
        800: '#6b21a8',
        900: '#581c87',
        950: '#3b0764',
      },
      throwing: {
        50: '#fdf2f8',
        100: '#fce7f3',
        200: '#fbcfe8',
        300: '#f9a8d4',
        400: '#f472b6',
        500: '#ec4899',
        600: '#db2777',
        700: '#be185d',
        800: '#9d174d',
        900: '#831843',
        950: '#500724',
      },
      
      // Couleurs pour les genres
      male: 'blue',     // Bleu pour les hommes
      female: 'pink',   // Rose pour les femmes
      
      // Couleurs pour les catégories
      u18: 'amber',
      u20: 'orange',
      u23: 'lime', 
      senior: 'cyan',
      master: 'indigo',
      
      // Couleurs additionnelles
      success: 'green',
      warning: 'amber',
      error: 'red',
      info: 'sky'
    },
    
    // Configuration globale des badges
    badge: {
      rounded: 'rounded-md',
      size: {
        '2xs': 'text-2xs px-1 py-0',
        xs: 'text-xs px-1.5 py-0.5',
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-2 py-1',
        lg: 'px-2.5 py-1.5',
        xl: 'px-3 py-2'
      },
      font: 'font-medium'
    },
    
    // Configuration des boutons
    button: {
      rounded: 'rounded-md',
      defaultVariants: {
        size: 'sm'
      }
    },
    
    // Configuration des cards
    card: {
      rounded: 'rounded-lg',
      shadow: 'shadow-md hover:shadow-lg transition-shadow duration-200',
      divide: 'divide-y divide-gray-200 dark:divide-gray-800'
    }
  }
})
