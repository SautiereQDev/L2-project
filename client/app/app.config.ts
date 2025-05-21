export default defineAppConfig({
  // https://ui.nuxt.com/getting-started/theme#design-system
  ui: {
    // Configuration des couleurs personnalisées
    colors: {
      // Couleurs principales
      primary: "emerald",
      neutral: "slate",
      accent: "rose",

      // Couleurs pour le genre
      male: "blue",
      female: "pink",

      // Couleurs pour les disciplines d'athlétisme
      running: "blue",
      jumping: "pink",
      throwing: "violet",
      u18: "amber",
      u20: "orange",
      u23: "lime",
      senior: "cyan",
      master: "indigo",

      // Couleurs additionnelles
      success: "green",
      warning: "amber",
      error: "red",
      info: "sky",
    },

    // Configuration globale des badges
    badge: {
      rounded: "rounded-md",
      size: {
        "2xs": "text-2xs px-1 py-0",
        xs: "text-xs px-1.5 py-0.5",
        sm: "text-xs px-2 py-1",
        md: "text-sm px-2 py-1",
        lg: "px-2.5 py-1.5",
        xl: "px-3 py-2",
      },
      font: "font-medium",
      color: {
        male: {
          solid: "bg-blue-500 text-white",
          subtle:
            "bg-blue-50 text-blue-500 dark:bg-blue-950 dark:text-blue-400",
        },
        female: {
          solid: "bg-pink-500 text-white",
          subtle:
            "bg-pink-50 text-pink-500 dark:bg-pink-950 dark:text-pink-400",
        },
        success: {
          solid: "bg-green-500 text-white",
          subtle:
            "bg-green-50 text-green-500 dark:bg-green-950 dark:text-green-400",
        },
      },
    },

    // Configuration des boutons
    button: {
      rounded: "rounded-md",
      defaultVariants: {
        size: "sm",
      },
    },

    // Configuration des cards
    card: {
      rounded: "rounded-lg",
      shadow: "shadow-md hover:shadow-lg transition-shadow duration-200",
      divide: "divide-y divide-gray-200 dark:divide-gray-800",
    },
  },
});
