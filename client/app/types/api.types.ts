// Types pour les réponses API
// Définition des structures de réponse génériques de l'API

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
  '@context': string;
  '@id': string;
  '@type': string;
  'hydra:totalItems': number;
  'hydra:member': T[];
  'hydra:view'?: {
    '@id': string;
    '@type': string;
    'hydra:first'?: string;
    'hydra:last'?: string;
    'hydra:next'?: string;
    'hydra:previous'?: string;
  };
}

/**
 * Type d'une réponse d'API paginée avec JSON-LD metadata
 */
export interface JsonLdCollection<T> {
  totalItems: number;
  member: T[];
  view?: {
    '@id'?: string;
    '@type'?: string;
    first?: string;
    last?: string;
    next?: string;
    previous?: string;
  };
}

/**
 * Transforme une réponse Hydra ou JSON-LD en ApiCollection standard
 */
export function normalizeHydraCollection<T>(data: JsonLdCollection<T> | HydraCollection<T>): ApiCollection<T> {
  // Support both hydra:member and member
  const items = 'hydra:member' in data ? data['hydra:member'] : data.member;
  // Support both hydra:totalItems and totalItems
  const totalItems = 'hydra:totalItems' in data ? data['hydra:totalItems'] : data.totalItems;

  // Determine pagination params
  let currentPage = 1;
  let itemsPerPage = 10;
  const view = ('hydra:view' in data ? data['hydra:view'] : (data as JsonLdCollection<T>).view);
  if (view?.['@id']) {
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    const url = new URL(view['@id'], base);
    const sp = url.searchParams;
    const p = sp.get('page');
    const ipp = sp.get('itemsPerPage');
    if (p) currentPage = parseInt(p, 10);
    if (ipp) itemsPerPage = parseInt(ipp, 10);
  }
  const totalPages = itemsPerPage > 0 ? Math.ceil(totalItems / itemsPerPage) : 1;

  return {items, totalItems, currentPage, pageSize: itemsPerPage, totalPages};
}
