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

// Hook pour récupérer tous les records
export function useRecords(filters: RecordFilters = {}) {
  return useQuery({
    queryKey: Object.keys(filters).length > 0 
      ? queryKeys.records.filtered(filters) 
      : queryKeys.records.all,
    queryFn: () => recordsService.getRecords(filters),
  });
}

// Hook pour récupérer un record par ID
export function useRecord(id: number) {
  return useQuery({
    queryKey: queryKeys.records.byId(id),
    queryFn: () => recordsService.getRecord(id),
  });
}

// Hook pour récupérer les records par catégorie avec filtres supplémentaires
export function useRecordsByCategory(category: string, additionalFilters: Omit<RecordFilters, 'category'> = {}) {
  const filters = ref({
    ...additionalFilters,
    category,
  });

  const query = useQuery({
    queryKey: queryKeys.records.byCategory(category),
    queryFn: () => recordsService.getRecordsByCategory(category),
    enabled: !!category, // N'exécuter que si une catégorie est sélectionnée
  });

  // Filtrer les résultats en fonction des filtres additionnels
  const filteredRecords = computed(() => {
    if (!query.data.value) return [];
    
    return query.data.value.filter((record) => { // Removed <Record> type annotation
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

  return {
    ...query,
    filteredRecords,
    filters,
  };
}

// Hook pour récupérer les records par discipline
export function useRecordsByDiscipline(disciplineType: string) {
  return useQuery({
    queryKey: queryKeys.records.byDiscipline(disciplineType),
    queryFn: () => recordsService.getRecordsByDiscipline(disciplineType),
  });
}

// Hook pour récupérer les records par genre
export function useRecordsByGenre(gender: string) {
  return useQuery({
    queryKey: queryKeys.records.byGenre(gender),
    queryFn: () => recordsService.getRecordsByGenre(gender),
  });
}

// Exemple d'un hook pour mettre à jour un record (mutation)
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
    },
  });
}
