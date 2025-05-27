/**
 * Types pour l'authentification et la gestion des utilisateurs
 */

export enum UserRoles {
  ADMIN = 'ROLE_ADMIN',
  USER = 'ROLE_USER',
  GUEST = 'ROLE_GUEST'
}

/**
 * Credentials pour l'authentification
 */
export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * Données d'inscription utilisateur
 */
export interface UserRegistrationData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Réponse d'authentification
 */
export type AuthResponse = DeniedAuthResponse | AcceptedAuthResponse;

export interface DeniedAuthResponse {
  title: string;
  detail: string;
  status: number;

}

export interface AcceptedAuthResponse {
  success: boolean;
  token?: string;
  user: UserProfile;
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
 * Réponse d'inscription
 */
export interface RegistrationResponse {
  success: boolean;
  user?: UserProfile;
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
  roles: UserRoles[];
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

/**
 * Erreur d'API
 */
export interface ApiError {
  code?: number;
  message?: string;
  detail?: string;
  violations?: Array<{ message: string; property?: string }>;
}

/**
 * Réponse d'erreur HTTP
 */
export interface HttpErrorResponse {
  status: number;
  statusText: string;
  data?: ApiError;
}

/**
 * Réponse de l'API générique
 */
export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T | null;
  errors: ApiError | null;
}

