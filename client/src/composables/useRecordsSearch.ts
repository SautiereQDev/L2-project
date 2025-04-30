import { ref, watch } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import type { RecordFilters } from '@/types';
import recordsService from '../services/records.service';
import { queryKeys } from './useRecords';

export function useRecordsSearch(initialFilters: RecordFilters = {}) {
  // État local pour stocker les filtres
  const filters = ref<RecordFilters>({ ...initialFilters });
  
  // État pour savoir si la recherche est activée
  const searchEnabled = ref(Object.keys(initialFilters).length > 0);
  
  // Requête Vue Query pour rechercher les records
  const query = useQuery({
    queryKey: queryKeys.records.filtered(filters.value),
    queryFn: () => recordsService.getRecords(filters.value),
    enabled: searchEnabled.value,
  });
  
  // Observer les changements de filtres pour actualiser la recherche
  watch(filters, (newFilters) => {
    // Vérifiez si au moins un filtre a une valeur
    const hasActiveFilters = Object.values(newFilters).some(
      value => value !== undefined && value !== null && value !== ''
    );
    
    // Activer ou désactiver la recherche en fonction de la présence de filtres
    searchEnabled.value = hasActiveFilters;
  }, { deep: true });
  
  // Fonction pour mettre à jour un filtre spécifique
  function updateFilter<K extends keyof RecordFilters>(
    key: K, 
    value: RecordFilters[K]
  ) {
    filters.value = {
      ...filters.value,
      [key]: value,
    };
  }
  
  // Fonction pour effacer tous les filtres
  function clearFilters() {
    filters.value = {};
    searchEnabled.value = false;
  }
  
  // Fonction pour exécuter manuellement une recherche
  function executeSearch() {
    if (Object.keys(filters.value).length > 0) {
      searchEnabled.value = true;
      query.refetch();
    }
  }
  
  return {
    filters,
    updateFilter,
    clearFilters,
    executeSearch,
    ...query,
  };
}
