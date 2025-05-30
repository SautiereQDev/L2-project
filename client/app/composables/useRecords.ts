// Composable unifié pour la gestion des records (liste, recherche, pagination) et détails
import { ref, computed, watch } from "vue";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import type { RecordFilters, RecordEntity } from "@/types";
import recordsService from "../services/records.service";
import apiService from "@/services/api";
import type { ApiCollection } from "~/types/api.types";
import queryKeys from "./queryKeys";

export interface UseRecordsOptions {
  initialFilters?: RecordFilters;
  initialPage?: number;
  initialPageSize?: number;
}

/**
 * Composable pour gérer la récupération et la pagination des records
 */
export function useRecords(options: UseRecordsOptions = {}) {
  // État local
  const filters = ref<RecordFilters>({ ...(options.initialFilters ?? {}) });
  const currentPage = ref<number>(options.initialPage ?? 1);
  const pageSize = ref<number>(options.initialPageSize ?? 10);

  // Utiliser un queryKey structuré suivant les recommandations de TanStack Query
  const recordsQueryKey = computed(() => [
    "records",
    {
      filters: filters.value,
      page: currentPage.value,
      pageSize: pageSize.value,
    },
  ]);

  // Configuration de la requête avec TanStack Query
  const {
    data: recordsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: recordsQueryKey.value,
    queryFn: () =>
      recordsService.getRecords({
        ...filters.value,
        page: currentPage.value,
        itemsPerPage: pageSize.value,
      }),
    select: (data: ApiCollection<RecordEntity>) => data,
    staleTime: 60 * 1000, // 1 minute
  });

  // Réexécuter la requête lorsque les filtres ou la pagination changent
  watch(
    [filters, currentPage, pageSize],
    () => {
      refetch();
    },
    { deep: true },
  );

  // Données dérivées
  const records = computed<RecordEntity[]>(
    () => recordsData.value?.items ?? [],
  );
  const totalItems = computed<number>(() => recordsData.value?.totalItems ?? 0);
  const totalPages = computed<number>(() => recordsData.value?.totalPages ?? 1);

  // Informations de pagination
  const paginationInfo = computed(() => ({
    currentPage: recordsData.value?.currentPage ?? currentPage.value,
    itemsPerPage: recordsData.value?.itemsPerPage ?? pageSize.value,
    totalItems: totalItems.value,
    totalPages: totalPages.value,
    hasNextPage: currentPage.value < totalPages.value,
    hasPreviousPage: currentPage.value > 1,
  }));

  // Actions
  function updateFilters(newFilters: RecordFilters) {
    filters.value = { ...newFilters };
    currentPage.value = 1; // Retour à la première page lors du changement de filtres
  }

  function setPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  }

  function setPageSize(size: number) {
    pageSize.value = size;
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value || 1;
    }
  }

  return {
    // État
    filters,
    currentPage,
    pageSize,
    records,
    totalItems,
    totalPages,
    paginationInfo,

    // État de la requête
    isLoading,
    isError,
    error,

    // Actions
    updateFilters,
    setPage,
    setPageSize,
    refetch,
  };
}

/**
 * Hook pour récupérer un record par ID
 * @param id - ID du record à récupérer
 * @returns Object - Query et données du record
 */
export function useRecord(id: number) {
  return useQuery({
    queryKey: queryKeys.records.detail(id),
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
export function useRecordsByCategory(
  category: string,
  additionalFilters: Omit<RecordFilters, "category"> = {},
) {
  // Combiner tous les filtres avec conversion de type pour la compatibilité
  const filters = ref<RecordFilters>({
    ...additionalFilters,
    category: category as any, // Conversion temporaire pour compatibilité
  });

  // Récupérer les records avec tous les filtres appliqués
  const query = useQuery({
    queryKey: queryKeys.records.category(category),
    queryFn: () => recordsService.getRecords(filters.value),
    enabled: !!category, // N'exécuter que si une catégorie est sélectionnée
  });

  // Extraire les records de la collection de réponse API
  const records = computed(() => query.data.value?.items ?? []);

  // Appliquer des filtres côté client si nécessaire
  const filteredRecords = computed(() => {
    if (!records.value.length) return [];

    return records.value.filter((record: RecordEntity) => {
      // Appliquer les filtres additionnels s'ils existent
      if (
        filters.value.disciplineType &&
        record.discipline.type !== filters.value.disciplineType
      ) {
        return false;
      }

      return !(filters.value.gender && record.genre !== filters.value.gender);
    });
  });

  // Informations de pagination
  const pagination = computed(() => {
    if (!query.data.value) {
      return {
        totalItems: 0,
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 10,
      };
    }

    return {
      totalItems: query.data.value.totalItems,
      currentPage: query.data.value.currentPage,
      totalPages: query.data.value.totalPages,
      itemsPerPage: query.data.value.itemsPerPage,
    };
  });

  return {
    ...query,
    records,
    filteredRecords,
    filters,
    pagination,
  };
}

/**
 * Hook pour récupérer les records par discipline
 * @param disciplineType - Type de discipline
 * @returns Object - Query et données paginées
 */
export function useRecordsByDiscipline(disciplineType: string) {
  const filters: RecordFilters = {
    disciplineType: disciplineType as any, // Conversion temporaire pour compatibilité
  };

  const query = useQuery({
    queryKey: queryKeys.records.discipline(disciplineType),
    queryFn: () => recordsService.getRecords(filters),
    enabled: !!disciplineType,
  });

  // Extraire les données de la collection pour faciliter l'accès
  const records = computed(() => query.data.value?.items ?? []);
  const pagination = computed(() => {
    if (!query.data.value) {
      return {
        totalItems: 0,
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 10,
      };
    }

    return {
      totalItems: query.data.value.totalItems,
      currentPage: query.data.value.currentPage,
      totalPages: query.data.value.totalPages,
      itemsPerPage: query.data.value.itemsPerPage,
    };
  });

  return {
    ...query,
    records,
    pagination,
  };
}

/**
 * Hook pour récupérer les records par genre
 * @param gender - Genre (homme/femme)
 * @returns Object - Query et données paginées
 */
export function useRecordsByGenre(gender: string) {
  const filters: RecordFilters = {
    gender: gender as any, // Conversion temporaire pour compatibilité
  };

  const query = useQuery({
    queryKey: queryKeys.records.genre(gender),
    queryFn: () => recordsService.getRecords(filters),
    enabled: !!gender,
  });

  // Extraire les données de la collection pour faciliter l'accès
  const records = computed(() => query.data.value?.items ?? []);
  const pagination = computed(() => {
    if (!query.data.value) {
      return {
        totalItems: 0,
        currentPage: 1,
        totalPages: 1,
        itemsPerPage: 10,
      };
    }

    return {
      totalItems: query.data.value.totalItems,
      currentPage: query.data.value.currentPage,
      totalPages: query.data.value.totalPages,
      itemsPerPage: query.data.value.itemsPerPage,
    };
  });

  return {
    ...query,
    records,
    pagination,
  };
}

/**
 * Hook pour mettre à jour un record (mutation)
 * @returns Mutation pour la mise à jour d'un record
 */
export function useUpdateRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<RecordEntity>;
    }) => {
      return await apiService
        .getClient()
        .put<RecordEntity>(`/records/${id}`, data)
        .then((res) => res.data);
    },
    onSuccess: (updatedRecord) => {
      // Invalider et rafraîchir toutes les requêtes qui pourraient être affectées
      queryClient.invalidateQueries({
        queryKey: queryKeys.records.all,
      });

      // Mettre à jour la requête spécifique pour ce record
      queryClient.setQueryData(
        queryKeys.records.detail(updatedRecord.id),
        updatedRecord,
      );

      // Invalider également les requêtes filtrées qui pourraient contenir ce record
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            Array.isArray(queryKey) &&
            queryKey[0] === "records" &&
            (queryKey[1] === "category" ||
              queryKey[1] === "discipline" ||
              queryKey[1] === "genre")
          );
        },
      });
    },
  });
}
