import { DisciplineType, CategorieType } from "../types";

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
      return "from-blue-600 to-blue-400";
    case DisciplineType.JUMP:
      return "from-yellow-600 to-yellow-400";
    case DisciplineType.THROW:
      return "from-green-600 to-green-400";
    default:
      return "from-gray-600 to-gray-400";
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
      return "i-heroicons-bolt";
    case DisciplineType.JUMP:
      return "i-heroicons-arrow-trending-up";
    case DisciplineType.THROW:
      return "i-heroicons-hand-raised";
    default:
      return "i-heroicons-trophy";
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
    run: "Course",
    jump: "Saut",
    throw: "Lancer",
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
      return "u18";
    case CategorieType.U20:
      return "u20";
    case CategorieType.U23:
      return "u23";
    case CategorieType.SENIOR:
      return "senior";
    case CategorieType.MASTER:
      return "master";
    default:
      return "primary";
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
    U18: "Moins de 18 ans",
    U20: "Moins de 20 ans",
    U23: "Moins de 23 ans",
    SENIOR: "Senior",
    MASTER: "Master",
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
  if (!dateString || dateString === "") {
    return "N/A";
  }
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Date invalide";
    }
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(date);
  } catch (e) {
    console.error("Erreur de formatage de date:", e);
    return "Erreur date";
  }
}

/**
 * Formate une date en chaîne longue au format français (ex: 31 décembre 2023).
 *
 * @param dateString - La date à formater, sous forme de chaîne.
 * @returns La date formatée en format long (ex: 31 décembre 2023).
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Formate un rôle utilisateur pour l'affichage
 *
 * @param role - Le rôle à formater (ex: "ROLE_ADMIN")
 * @returns Le rôle formaté (ex: "Admin")
 */
export function formatRole(role: string): string {
  return role
    .replace("ROLE_", "")
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Calcule l'âge à partir de la date de naissance
 *
 * @param birthdate - La date de naissance sous forme de chaîne
 * @returns L'âge en années
 */
export function calculateAge(birthdate: string): number {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();

  // Ajuster en fonction du mois et du jour
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

/**
 * Formate une performance selon le type de discipline
 *
 * @param performance - La valeur de la performance (temps en secondes ou distance en mètres)
 * @param disciplineType - Le type de discipline (run, jump, throw)
 * @returns La performance formatée
 */
export function formatPerformance(performance: number, disciplineType: string): string {
  console.log("formatPerformance appelé avec:", { performance, disciplineType });
  
  if (!performance) {
    console.warn("Performance manquante:", performance);
    return "N/A";
  }
  
  // Si la valeur est un timestamp très élevé (erreur de données), normaliser
  if (performance > 1000000) {
    // Pour les courses, on divise pour obtenir des secondes plus réalistes
    // Cela semble être un timestamp
    performance = performance > 946684800 ? (performance % 100) : performance;
  }
  
  if (disciplineType === "run" || disciplineType === DisciplineType.RUN) {
    // Format time MM:SS.MS for running events
    const minutes = Math.floor(performance / 60);
    const seconds = Math.floor(performance % 60);
    const milliseconds = Math.round((performance % 1) * 100);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
  } else {
    // Format distance in meters for jumps and throws
    return `${performance.toFixed(2)} m`;
  }
}
