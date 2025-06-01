/**
 * Utilitaires généraux pour l'application
 * Regroupe les petites fonctions utilitaires pour éviter la multiplication des fichiers
 */
import type { Athlete } from "~/types";

/**
 * Fonction de debounce pour limiter le nombre d'appels à une fonction
 * @param fn Fonction à exécuter
 * @param delay Délai en ms
 * @returns Fonction debounced
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>): void {
    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      fn(...args);
      timeout = null;
    }, delay);
  };
}

/**
 * Obtenir une image de profil placeholder pour un athlète
 * @param athlete L'athlète pour lequel générer le placeholder
 * @returns URL de l'image placeholder
 */
export function getAthletePlaceholderImage(athlete: Athlete): string {
  if (!athlete || !athlete.lastname) {
    // Fallback si l'athlète ou son nom n'est pas disponible
    return "https://i.pravatar.cc/150?img=0";
  }
  
  try {
    // Dans une vraie application, utilisez une véritable URL d'image
    const hash = athlete.lastname.charCodeAt(0) % 10;
    return `https://i.pravatar.cc/150?img=${hash}`;
  } catch (e) {
    console.error("Erreur lors de la génération de l'image placeholder:", e);
    return "https://i.pravatar.cc/150?img=0";
  }
}

/**
 * Compare deux valeurs numériques pour les tris
 * @param a Première valeur
 * @param b Seconde valeur
 * @returns -1, 0 ou 1 selon la comparaison
 */
export function compareValues(a: number, b: number): number {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}
