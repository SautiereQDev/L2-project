/**
 * Fichier consolidé des types - contient tous les types de l'application
 * Centralise tous les types pour réduire le nombre de fichiers
 */

// Types pour les entités métier
export * from "./record.types";

// === API TYPES ===
// Types pour les réponses API génériques

/**
 * Type générique pour une collection d'éléments retournée par l'API
 */
export interface ApiCollection<T> {
  items: T[];
  totalItems: number;
  page?: number;
  pageSize?: number;
  itemsPerPage?: number;
  currentPage?: number;
  totalPages?: number;
}

/**
 * Type générique pour une réponse d'API
 */
export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T | null;
  errors: ApiError | null;
}

/**
 * Type d'erreur standard de l'API
 */
export interface ApiError {
  code: number;
  message: string;
}

/**
 * Type d'une réponse d'API paginée avec hydra metadata (format API Platform)
 */
export interface HydraCollection<T> {
  "@context": string;
  "@id": string;
  "@type": string;
  "hydra:totalItems": number;
  "hydra:member": T[];
  "hydra:view"?: {
    "@id": string;
    "@type": string;
    "hydra:first"?: string;
    "hydra:last"?: string;
    "hydra:next"?: string;
    "hydra:previous"?: string;
  };
}

/**
 * Type d'une réponse d'API paginée avec JSON-LD metadata
 */
export interface JsonLdCollection<T> {
  totalItems: number;
  member: T[];
  view?: {
    "@id"?: string;
    "@type"?: string;
    first?: string;
    last?: string;
    next?: string;
    previous?: string;
  };
}

/**
 * Transforme une réponse Hydra ou JSON-LD en ApiCollection standard
 */
export function normalizeHydraCollection<T>(
  data: JsonLdCollection<T> | HydraCollection<T>,
): ApiCollection<T> {
  // Support both hydra:member and member
  const items = "hydra:member" in data ? data["hydra:member"] : data.member || [];
  // Support both hydra:totalItems and totalItems
  const totalItems =
    "hydra:totalItems" in data ? data["hydra:totalItems"] : data.totalItems || 0;

  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];

  // Determine pagination params
  let currentPage = 1;
  let itemsPerPage = 10;
  const view =
    "hydra:view" in data
      ? data["hydra:view"]
      : (data as JsonLdCollection<T>).view;
  if (view?.["@id"]) {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    const url = new URL(view["@id"], base);
    const sp = url.searchParams;
    const p = sp.get("page");
    const ipp = sp.get("itemsPerPage");
    if (p) currentPage = parseInt(p, 10);
    if (ipp) itemsPerPage = parseInt(ipp, 10);
  }
  const totalPages =
    itemsPerPage > 0 ? Math.ceil(totalItems / itemsPerPage) : 1;

  return { 
    items: safeItems, 
    totalItems, 
    currentPage, 
    pageSize: itemsPerPage, 
    totalPages 
  };
}

// === AUTH TYPES ===
// Types pour l'authentification et la gestion des utilisateurs

export enum UserRoles {
  ADMIN = "ROLE_ADMIN",
  USER = "ROLE_USER",
  GUEST = "ROLE_GUEST",
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
