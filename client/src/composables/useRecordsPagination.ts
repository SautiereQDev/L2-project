import { ref, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import type { RecordEntity } from '@/types';
import recordsService from '../services/records.service';
import queryKeys from './queryKeys';

interface PaginationOptions {
  initialPage?: number;
  pageSize?: number;
}

export function useRecordsPagination(options: PaginationOptions = {}) {
  // État local
  const currentPage = ref(options.initialPage || 1);
  const pageSize = ref(options.pageSize || 10);
  
  // Nombre total d'éléments (sera mis à jour si l'API le fournit)
  const totalItems = ref(0);
  
  // Requête paginée avec TanStack Query
  const query = useQuery({
    queryKey: queryKeys.records.paginated(currentPage.value, pageSize.value),
    queryFn: async () => {
      try {
        // Transformer pour API Platform
        const params: Record<string, any> = {
          'page': currentPage.value,
          'itemsPerPage': pageSize.value,
          'isCurrentRecord': true, // Optionnel: filtre uniquement les records actuels
        };
        
        const result = await recordsService.getRecords(params);
        
        // Si l'API renvoie hydra:totalItems, on peut récupérer le total
        // Dans notre mock, on simule juste avec la longueur du tableau
        totalItems.value = Array.isArray(result) ? result.length * 3 : 0; // Simulation
        
        return result;
      } catch (error) {
        console.error('Erreur lors de la récupération des records paginés:', error);
        throw error;
      }
    },
    staleTime: 500, // Garder les anciennes données pendant le chargement (alternative à keepPreviousData)
  });
  
  // Informations sur la pagination
  const paginationInfo = computed(() => ({
    currentPage: currentPage.value,
    pageSize: pageSize.value,
    totalItems: totalItems.value,
    totalPages: Math.ceil(totalItems.value / pageSize.value),
    hasNextPage: currentPage.value < Math.ceil(totalItems.value / pageSize.value),
    hasPrevPage: currentPage.value > 1,
  }));
  
  // Fonctions pour changer de page
  function nextPage() {
    if (paginationInfo.value.hasNextPage) {
      currentPage.value++;
    }
  }
  
  function prevPage() {
    if (paginationInfo.value.hasPrevPage) {
      currentPage.value--;
    }
  }
  
  function goToPage(page: number) {
    if (page >= 1 && page <= paginationInfo.value.totalPages) {
      currentPage.value = page;
    }
  }
  
  return {
    // État et données
    records: computed(() => query.data as unknown as RecordEntity[] || []),
    currentPage,
    pageSize,
    paginationInfo,
    
    // Fonctions
    nextPage,
    prevPage,
    goToPage,
    
    // Statut de la requête
    isLoading: computed(() => query.isLoading.value),
    isError: computed(() => query.isError.value),
    error: computed(() => query.error.value),
    refetch: query.refetch,
  };
}
