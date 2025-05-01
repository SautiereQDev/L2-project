import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { ref, computed } from 'vue';
import type { RecordEntity, RecordFilters } from '@/types';
import recordsService from '../services/records.service';
import apiService from '../services/api.service';

// Clés de requête pour Vue Query
export const queryKeys = {
  records: {
    all: ['records'],
    byId: (id: number) => [...queryKeys.records.all, id],
    byCategory: (category: string) => [...queryKeys.records.all, 'category', category],
    byDiscipline: (disciplineType: string) => [...queryKeys.records.all, 'discipline', disciplineType],
    byGenre: (gender: string) => [...queryKeys.records.all, 'genre', gender],
    // Cloner les filtres pour s'assurer qu'ils sont sérialisables
    filtered: (filters: RecordFilters) => [...queryKeys.records.all, 'filtered', JSON.stringify(filters)],
  },
};

/**
 * Hook pour récupérer tous les records avec pagination et filtres
 * @param filters - Filtres optionnels à appliquer
 * @returns Object - Query et données paginées
 */
export function useRecords(filters: RecordFilters = {}) {
  const query = useQuery({
    queryKey: Object.keys(filters).length > 0 
      ? queryKeys.records.filtered(filters) 
      : queryKeys.records.all,
    queryFn: () => recordsService.getRecords(filters),
  });
  
  // Extraire les données de la collection pour faciliter l'accès
  const records = computed(() => query.data.value?.items || []);
  const pagination = computed(() => {
    if (!query.data.value) {
      return {
        totalItems: 0,
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 10
      };
    }
    
    return {
      totalItems: query.data.value.totalItems,
      currentPage: query.data.value.currentPage,
      totalPages: query.data.value.totalPages,
      itemsPerPage: query.data.value.itemsPerPage
    };
  });
  
  return {
    ...query,
    records,
    pagination
  };
}

/**
 * Hook pour récupérer un record par ID
 * @param id - ID du record à récupérer
 * @returns Object - Query et données du record
 */
export function useRecord(id: number) {
  return useQuery({
    queryKey: queryKeys.records.byId(id),
    queryFn: () => recordsService.getRecord(id),
    enabled: id > 0, // N'exécuter que si l'ID est valide
  });
}

/**
 * Hook pour récupérer les records par catégorie avec filtres supplémentaires
 * @param category - Catégorie à filtrer
 * @param additionalFilters - Filtres additionnels à appliquer
 * @returns Object - Query et données filtrées
 */
export function useRecordsByCategory(category: string, additionalFilters: Omit<RecordFilters, 'category'> = {}) {
  // Combiner tous les filtres avec conversion de type pour la compatibilité
  const filters = ref<RecordFilters>({
    ...additionalFilters,
    category: category as any // Conversion temporaire pour compatibilité
  });

  // Récupérer les records avec tous les filtres appliqués
  const query = useQuery({
    queryKey: queryKeys.records.byCategory(category),
    queryFn: () => recordsService.getRecords(filters.value),
    enabled: !!category, // N'exécuter que si une catégorie est sélectionnée
  });

  // Extraire les records de la collection de réponse API
  const records = computed(() => query.data.value?.items || []);
  
  // Appliquer des filtres côté client si nécessaire
  const filteredRecords = computed(() => {
    if (!records.value.length) return [];
    
    return records.value.filter((record: RecordEntity) => {
      // Appliquer les filtres additionnels s'ils existent
      if (filters.value.disciplineType && record.discipline.type !== filters.value.disciplineType) {
        return false;
      }
      
      if (filters.value.gender && record.genre !== filters.value.gender) {
        return false;
      }
      
      return true;
    });
  });

  // Informations de pagination
  const pagination = computed(() => {
    if (!query.data.value) {
      return {
        totalItems: 0,
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 10
      };
    }
    
    return {
      totalItems: query.data.value.totalItems,
      currentPage: query.data.value.currentPage,
      totalPages: query.data.value.totalPages,
      itemsPerPage: query.data.value.itemsPerPage
    };
  });

  return {
    ...query,
    records,
    filteredRecords,
    filters,
    pagination
  };
}

/**
 * Hook pour récupérer les records par discipline
 * @param disciplineType - Type de discipline
 * @returns Object - Query et données paginées
 */
export function useRecordsByDiscipline(disciplineType: string) {
  const filters: RecordFilters = { 
    disciplineType: disciplineType as any // Conversion temporaire pour compatibilité
  };
  
  const query = useQuery({
    queryKey: queryKeys.records.byDiscipline(disciplineType),
    queryFn: () => recordsService.getRecords(filters),
    enabled: !!disciplineType
  });
  
  // Extraire les données de la collection pour faciliter l'accès
  const records = computed(() => query.data.value?.items || []);
  const pagination = computed(() => {
    if (!query.data.value) {
      return {
        totalItems: 0,
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 10
      };
    }
    
    return {
      totalItems: query.data.value.totalItems,
      currentPage: query.data.value.currentPage,
      totalPages: query.data.value.totalPages,
      itemsPerPage: query.data.value.itemsPerPage
    };
  });
  
  return {
    ...query,
    records,
    pagination
  };
}

/**
 * Hook pour récupérer les records par genre
 * @param gender - Genre (homme/femme)
 * @returns Object - Query et données paginées
 */
export function useRecordsByGenre(gender: string) {
  const filters: RecordFilters = { 
    gender: gender as any // Conversion temporaire pour compatibilité
  };
  
  const query = useQuery({
    queryKey: queryKeys.records.byGenre(gender),
    queryFn: () => recordsService.getRecords(filters),
    enabled: !!gender
  });
  
  // Extraire les données de la collection pour faciliter l'accès
  const records = computed(() => query.data.value?.items || []);
  const pagination = computed(() => {
    if (!query.data.value) {
      return {
        totalItems: 0,
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 10
      };
    }
    
    return {
      totalItems: query.data.value.totalItems,
      currentPage: query.data.value.currentPage,
      totalPages: query.data.value.totalPages,
      itemsPerPage: query.data.value.itemsPerPage
    };
  });
  
  return {
    ...query,
    records,
    pagination
  };
}

/**
 * Hook pour mettre à jour un record (mutation)
 * @returns Mutation pour la mise à jour d'un record
 */
export function useUpdateRecord() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<RecordEntity> }) => {
      return await apiService.put<RecordEntity>(`/records/${id}`, data);
    },
    onSuccess: (updatedRecord) => {
      // Invalider et rafraîchir toutes les requêtes qui pourraient être affectées
      queryClient.invalidateQueries({
        queryKey: queryKeys.records.all,
      });
      
      // Mettre à jour la requête spécifique pour ce record
      queryClient.setQueryData(
        queryKeys.records.byId(updatedRecord.id), 
        updatedRecord
      );
      
      // Invalider également les requêtes filtrées qui pourraient contenir ce record
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return Array.isArray(queryKey) && 
                queryKey[0] === 'records' && 
                (queryKey[1] === 'category' || 
                 queryKey[1] === 'discipline' || 
                 queryKey[1] === 'genre');
        }
      });
    },
  });
}
