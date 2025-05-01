import type { RecordFilters } from "@/types";

// Structure des clés de requêtes pour éviter les duplications
export const queryKeys = {
  // Clés pour les records
  records: {
    all: ['records'],
    lists: () => [...queryKeys.records.all, 'list'],
    list: (filters: RecordFilters = {}) => [...queryKeys.records.lists(), { filters }],
    details: () => [...queryKeys.records.all, 'detail'],
    detail: (id: number) => [...queryKeys.records.details(), id],
    filtered: (filters: RecordFilters) => [
      ...queryKeys.records.all,
      'filtered',
      filters
    ],
    category: (category: string) => [...queryKeys.records.all, 'category', category],
    discipline: (disciplineType: string) => [...queryKeys.records.all, 'discipline', disciplineType],
    genre: (gender: string) => [...queryKeys.records.all, 'genre', gender],
    paginated: (page: number, pageSize: number) => [...queryKeys.records.all, 'paginated', page, pageSize],
  },
  
  // Clés pour les disciplines
  disciplines: {
    all: ['disciplines'],
    detail: (id: number) => [...queryKeys.disciplines.all, id],
    byType: (type: string) => [...queryKeys.disciplines.all, 'type', type],
  },
  
  // Clés pour les athlètes
  athletes: {
    all: ['athletes'],
    detail: (id: number) => [...queryKeys.athletes.all, id],
    records: (id: number) => [...queryKeys.athletes.detail(id), 'records'],
    byCountry: (country: string) => [...queryKeys.athletes.all, 'country', country],
  },
  
  // Clés pour les lieux
  locations: {
    all: ['locations'],
    detail: (id: number) => [...queryKeys.locations.all, id],
    records: (id: number) => [...queryKeys.locations.detail(id), 'records'],
    byCountry: (country: string) => [...queryKeys.locations.all, 'country', country],
  },
};

export default queryKeys;
