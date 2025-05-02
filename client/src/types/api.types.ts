// Types pour les réponses API
// Définition des structures de réponse génériques de l'API

/**
 * Type générique pour une collection d'éléments retournée par l'API
 */
export interface ApiCollection<T> {
  items: T[];
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

/**
 * Type générique pour une réponse d'erreur API
 */
export interface ApiError {
  status: number;
  title: string;
  detail: string;
  violations?: Array<{
    propertyPath: string;
    message: string;
  }>;
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
 * Transforme une réponse Hydra en ApiCollection standard
 */
export function normalizeHydraCollection<T>(hydraData: HydraCollection<T>): ApiCollection<T> {
  // Valeur par défaut
  let itemsPerPage = 30;
  let currentPage = 1;
  let totalPages = 1;

  // Extraire itemsPerPage et currentPage depuis hydra:view si possible
  if (hydraData['hydra:view']?.['@id']) {
    const url = new URL(hydraData['hydra:view']['@id'], 'http://dummy');
    const pageParam = url.searchParams.get('page');
    const itemsPerPageParam = url.searchParams.get('itemsPerPage');
    if (itemsPerPageParam && !isNaN(Number(itemsPerPageParam))) {
      itemsPerPage = Number(itemsPerPageParam);
    }
    if (pageParam && !isNaN(Number(pageParam))) {
      currentPage = Number(pageParam);
    }
  }
  if (itemsPerPage > 0) {
    totalPages = Math.ceil(hydraData['hydra:totalItems'] / itemsPerPage);
  }

  return {
    items: hydraData['hydra:member'],
    totalItems: hydraData['hydra:totalItems'],
    itemsPerPage,
    currentPage,
    totalPages
  };
}
