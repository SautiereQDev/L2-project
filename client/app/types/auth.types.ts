import type {ApiError} from './api.types';

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
export interface UserRegistrationCredentials {
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
  success: boolean;
  code: number;
  message: string;
  data?: null;
  errors: ApiError;
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