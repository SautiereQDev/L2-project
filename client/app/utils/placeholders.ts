import type { Athlete } from "~/types";

// Obtenir une image de profil placeholder pour un athlète
export function getAthletePlaceholderImage(athlete: Athlete): string {
  // Dans une vraie application, utilisez une véritable URL d'image
  const hash = athlete.lastname.charCodeAt(0) % 10;
  return `https://i.pravatar.cc/150?img=${hash}`;
}