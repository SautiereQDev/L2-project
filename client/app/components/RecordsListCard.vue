<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center">
        <h3 class="text-base font-semibold">Liste des records</h3>
        <UBadge :color="isLoading ? 'warning' : 'success'" class="ml-2">
          {{ isLoading ? 'Chargement...' : (records.length || 0) + ' records' }}
        </UBadge>
      </div>
    </template>

    <div class="min-h-[400px]">
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
        <Spinner class="mb-4"/>
        <p class="text-sm text-gray-500">Chargement des records...</p>
      </div>
      <div v-else-if="isError" class="flex flex-col items-center justify-center py-6">
        <UAlert
            :title="'Erreur de chargement'"
            :description="error?.message || 'Une erreur est survenue lors du chargement des records.'"
            color="error"
            variant="soft"
            icon="i-heroicons-exclamation-circle"
            class="mb-4 max-w-md"
        />
        <UButton color="primary" icon="i-heroicons-arrow-path" @click="refetch">
          Réessayer
        </UButton>
      </div>
      <div v-else>
        <RecordsTable
            :records="records"
            :sort-field="sortField"
            :sort-order="sortOrder"
            @show-details="showDetails"
            @update:sort="handleSort"
        />
      </div>
    </div>

    <template v-if="!isLoading && !isError && totalPages > 1" #footer>
      <div class="flex justify-center">
        <UPagination
            :model-value="currentPage"
            :total="totalPages"
            @update:model-value="handlePageChange"
        />
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import Spinner from './ui/Spinner.vue';
import RecordsTable from './RecordsTable.vue';
import {ref, watch} from 'vue';
import type {RecordEntity, RecordFilters} from '~/types';
import {useRecords} from '~/composables/useRecords';

const props = defineProps({
  initialFilters: {
    type: Object as () => RecordFilters,
    default: () => ({})
  },
  initialPage: {
    type: Number,
    default: 1
  },
  initialPageSize: {
    type: Number,
    default: 10
  }
});

const emit = defineEmits(['show-details']);

const sortField = ref('discipline.name'); // Default sort field
const sortOrder = ref<'asc' | 'desc'>('desc'); // Default sort order

const {
  records,
  // totalItems, // totalItems n'est pas directement utilisé dans le template, records.length l'est
  totalPages,
  currentPage, // Ceci est une ref de useRecords
  isLoading,
  isError,
  error,
  updateFilters,
  setPage, // setPage est utilisé par handlePageChange
  refetch
} = useRecords({
  initialFilters: {...props.initialFilters, sort: sortField.value, order: sortOrder.value},
  initialPage: props.initialPage,
  initialPageSize: props.initialPageSize
});

// Watch for external filter changes from parent
watch(() => props.initialFilters, (newFiltersFromProps) => {
  if (newFiltersFromProps) {
    // Merge external filters with current sort order
    updateFilters({
      ...newFiltersFromProps,
      sort: sortField.value,
      order: sortOrder.value
    });
  }
}, {deep: true});

// Watch for internal sorting changes
watch([sortField, sortOrder], (newSort) => {
  updateFilters({
    ...props.initialFilters, // Base with current external filters
    sort: newSort[0],
    order: newSort[1]
  });
});

function showDetails(record: RecordEntity) {
  emit('show-details', record);
}

function handleSort(field: string, order: 'asc' | 'desc') {
  sortField.value = field;
  sortOrder.value = order;
}

function handlePageChange(newPage: number) {
  setPage(newPage);
}
</script>