import { DisciplineType, CategorieType } from "~/types";

/**
 * Returns a gradient string based on the discipline type.
 *
 * @param type - The discipline type (e.g., RUN, JUMP, THROW).
 * @returns A string representing the gradient for the given discipline type.
 *          Defaults to a gray gradient if the type is unknown.
 */
export function getDisciplineGradient(type: string): string {
  switch (type) {
    case DisciplineType.RUN:
      return 'from-blue-600 to-blue-400';
    case DisciplineType.JUMP:
      return 'from-yellow-600 to-yellow-400';
    case DisciplineType.THROW:
      return 'from-green-600 to-green-400';
    default:
      return 'from-gray-600 to-gray-400';
  }
}

/**
 * Returns an icon class name based on the discipline type.
 *
 * @param type - The discipline type (e.g., RUN, JUMP, THROW).
 * @returns A string representing the icon class for the given discipline type.
 *          Defaults to a trophy icon if the type is unknown.
 */
export function getDisciplineIcon(type: string): string {
  switch (type) {
    case DisciplineType.RUN:
      return 'i-heroicons-bolt';
    case DisciplineType.JUMP:
      return 'i-heroicons-arrow-trending-up';
    case DisciplineType.THROW:
      return 'i-heroicons-hand-raised';
    default:
      return 'i-heroicons-trophy';
  }
}

/**
 * Returns a label for the given discipline type.
 *
 * @param type - The discipline type as a string (e.g., 'run', 'jump', 'throw').
 * @returns A string representing the label for the given discipline type.
 *          Returns the input type if no label is found.
 */
export function getDisciplineTypeLabel(type: string): string {
  const types: Record<string, string> = {
    'run': 'Course',
    'jump': 'Saut',
    'throw': 'Lancer'
  };

  return types[type] ?? type;
}

/**
 * Returns a string representing the color associated with a given category.
 *
 * @param category - The category for which to get the color.
 * @returns The color string corresponding to the provided category.
 *          Returns 'u18', 'u20', 'u23', 'senior', or 'master' for known categories,
 *          or 'primary' as a default for unknown categories.
 */
export function getCategoryColor(category: CategorieType): string {
  switch (category) {
    case CategorieType.U18:
      return 'u18';
    case CategorieType.U20:
      return 'u20';
    case CategorieType.U23:
      return 'u23';
    case CategorieType.SENIOR:
      return 'senior';
    case CategorieType.MASTER:
      return 'master';
    default:
      return 'primary';
  }
}

/**
 * Returns a label for the given category.
 *
 * @param category - The category as a `CategorieType` (e.g., U18, U20, SENIOR).
 * @returns A string representing the label for the given category.
 *          Returns the input category if no label is found.
 */
export function getCategoryLabel(category: CategorieType): string {
  const categoryLabels: Record<CategorieType, string> = {
    'U18': 'Moins de 18 ans',
    'U20': 'Moins de 20 ans',
    'U23': 'Moins de 23 ans',
    'SENIOR': 'Senior',
    'MASTER': 'Master'
  };

  return categoryLabels[category] || category;
}

/**
 * Formate une date en chaîne compacte au format français (jj/mm/aa).
 *
 * @param dateString - La date à formater, sous forme de chaîne.
 * @returns La date formatée en format compact (ex: 31/12/23).
 */
export function formatCompactDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  }).format(date);
}

/**
 * Formate une date en chaîne longue au format français (ex: 31 décembre 2023).
 *
 * @param dateString - La date à formater, sous forme de chaîne.
 * @returns La date formatée en format long (ex: 31 décembre 2023).
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date);
}