/**
 * Types pour l'authentification et la gestion des utilisateurs
 */

/**
 * Credentials pour l'authentification
 */
export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * Réponse d'authentification
 */
export interface AuthResponse {
  success: boolean;
  token?: string;
  error?: string;
}

/**
 * Réponse de rafraîchissement de token
 */
export interface RefreshResponse {
  success: boolean;
  token?: string;
  error?: string;
}

/**
 * Profil utilisateur
 */
export interface UserProfile {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Token JWT décodé
 */
export interface DecodedToken {
  // Champs standard JWT
  iss?: string;       // Émetteur
  sub?: string;       // Sujet (généralement l'ID utilisateur)
  aud?: string[];     // Audience
  exp?: number;       // Timestamp d'expiration
  nbf?: number;       // Not Before (pas valide avant)
  iat?: number;       // Issued At (émis à)
  jti?: string;       // JWT ID
  
  // Champs personnalisés (ajustez selon votre implémentation)
  username?: string;
  roles?: string[];
  email?: string;
}
