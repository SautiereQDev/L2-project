// client/src/composables/useRecordsPagination.ts
import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type { RecordEntity, RecordFilters } from '@/types'
import type { ApiCollection } from '@/types/api.types'
import recordsService from '@/services/records.service'

export interface PaginationOptions {
  initialPage?: number
  pageSize?: number
}

/**
 * Composable de pagination côté serveur (API Platform).
 */
export function useRecordsPagination(
  filters: RecordFilters = {},
  options: PaginationOptions = {}
) {
  const initialPage = options.initialPage ?? 1
  const initialSize = options.pageSize   ?? 10

  const currentPage = ref<number>(initialPage)
  const pageSize    = ref<number>(initialSize)

  const query = useQuery<ApiCollection<RecordEntity>, Error>({
    queryKey: computed(() => [
      'records',
      JSON.stringify(filters),
      currentPage.value,
      pageSize.value,
    ]),
    queryFn: () =>
      recordsService.getRecords({
        ...filters,
        page: currentPage.value,
        itemsPerPage: pageSize.value,
        pagination: true,
        partial: false,
        format: 'json',
      } as any),
  })

  const records = computed<RecordEntity[]>(() => query.data.value?.items ?? [])

  const paginationInfo = computed(() => {
    const d = query.data.value
    const cp = d?.currentPage   ?? currentPage.value
    const ipp= d?.itemsPerPage  ?? pageSize.value
    const tp = d?.totalPages    ?? 1
    return {
      currentPage: cp,
      itemsPerPage: ipp,
      totalItems:   d?.totalItems    ?? 0,
      totalPages:   tp,
      hasNextPage:  cp < tp,
      hasPrevPage:  cp > 1,
    }
  })

  function nextPage() { if (paginationInfo.value.hasNextPage) currentPage.value++ }
  function prevPage() { if (paginationInfo.value.hasPrevPage) currentPage.value-- }
  function goToPage(n: number) {
    if (n >= 1 && n <= paginationInfo.value.totalPages) {
      currentPage.value = n
    }
  }
  function setPageSize(n: number) {
    pageSize.value = n
    currentPage.value = initialPage
  }

  return {
    records,
    currentPage,
    pageSize,
    paginationInfo,
    nextPage,
    prevPage,
    goToPage,
    setPageSize,
    isLoading: query.isLoading,
    isError:   query.isError,
    error:     query.error,
    refetch:   query.refetch,
  }
}