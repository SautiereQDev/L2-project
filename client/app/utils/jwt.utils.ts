/**
 * Utilitaires pour la gestion des tokens JWT
 */

/**
 * Interface pour le payload décodé d'un token JWT
 */
export interface DecodedJwtPayload {
  exp?: number;      // Expiration time
  iat?: number;      // Issued at
  nbf?: number;      // Not valid before
  sub?: string;      // Subject (typically the user ID)
  roles?: string[];  // User roles
  username?: string; // Username
  [key: string]: any; // Autres champs personnalisés
}

/**
 * Décode le payload d'un token JWT sans validation
 * @param token Token JWT à décoder
 * @returns Le payload décodé ou null si le token est invalide
 */
export function decodeJwtPayload(token: string | null): DecodedJwtPayload | null {
  if (!token) return null;
  
  try {
    // La structure d'un JWT est: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Décoder la partie payload (Base64Url)
    const payload = parts[1];
    const base64 = payload?.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64 as string)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erreur lors du décodage du token JWT:', error);
    return null;
  }
}

/**
 * Vérifie si un token JWT est expiré
 * @param token Token JWT à vérifier
 * @param bufferSeconds Marge de sécurité en secondes (défaut: 30)
 * @returns true si le token est expiré ou invalide, false sinon
 */
export function isTokenExpired(token: string | null, bufferSeconds: number = 30): boolean {
  if (!token) return true;
  
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return true;
  
  // Ajouter une marge de sécurité pour éviter les problèmes de synchronisation
  const currentTime = Math.floor(Date.now() / 1000); // Convertir en secondes
  return payload.exp <= (currentTime + bufferSeconds);
}

/**
 * Obtient le temps restant avant l'expiration d'un token en secondes
 * @param token Token JWT à vérifier
 * @returns Le nombre de secondes avant expiration ou -1 si le token est invalide
 */
export function getTokenRemainingTime(token: string | null): number {
  if (!token) return -1;
  
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return -1;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - currentTime);
}

/**
 * Vérifie si un token doit être rafraîchi
 * @param token Token JWT à vérifier
 * @param thresholdMinutes Seuil en minutes avant l'expiration pour considérer un rafraîchissement
 * @returns true si le token doit être rafraîchi, false sinon
 */
export function shouldRefreshToken(token: string | null, thresholdMinutes: number = 5): boolean {
  if (!token) return false;
  
  const remainingSeconds = getTokenRemainingTime(token);
  const thresholdSeconds = thresholdMinutes * 60;
  
  return remainingSeconds > 0 && remainingSeconds < thresholdSeconds;
}
