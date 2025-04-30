import { ref, computed } from 'vue';
import {type RecordFilters } from '../services/records.service';
import { useQuery } from '@tanstack/vue-query';
import recordsService from '../services/records.service';

export interface PaginationOptions {
  pageSize: number;
  initialPage?: number;
}

export function usePaginatedRecords(
  filters: RecordFilters = {},
  paginationOptions: PaginationOptions = { pageSize: 10, initialPage: 1 }
) {
  // État de pagination
  const currentPage = ref(paginationOptions.initialPage || 1);
  const pageSize = ref(paginationOptions.pageSize);
  
  // Requête pour obtenir tous les records filtrés
  const query = useQuery({
    queryKey: ['records', 'filtered', JSON.stringify(filters)],
    queryFn: () => recordsService.getRecords(filters),
  });
  
  // Total des records
  const totalRecords = computed(() => query.data.value?.length || 0);
  
  // Nombre total de pages
  const totalPages = computed(() => 
    Math.ceil(totalRecords.value / pageSize.value)
  );
  
  // Records de la page courante
  const paginatedRecords = computed(() => {
    if (!query.data.value) return [];
    
    const startIndex = (currentPage.value - 1) * pageSize.value;
    const endIndex = startIndex + pageSize.value;
    
    return query.data.value.slice(startIndex, endIndex);
  });
  
  // Fonction pour changer de page
  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  }
  
  // Fonction pour aller à la page suivante
  function nextPage() {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  }
  
  // Fonction pour aller à la page précédente
  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  }
  
  // Fonction pour changer la taille de la page
  function setPageSize(size: number) {
    pageSize.value = size;
    // Ajuster la page courante pour éviter les pages vides
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value;
    }
  }
  
  return {
    // États de pagination
    currentPage,
    pageSize,
    totalRecords,
    totalPages,
    paginatedRecords,
    
    // Fonctions de pagination
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    
    // État de la requête
    isLoading: query.isPending,
    error: query.error,
    isError: query.isError,
    refetch: query.refetch,
  };
}
