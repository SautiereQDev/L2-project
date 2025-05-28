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
        <UButton color="primary" icon="i-heroicons-arrow-path" @click="onRefetch">
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
      <div class="flex justify-center space-x-2 items-center py-4">
        <UButton
            size="sm"
            variant="outline"
            :disabled="currentPage <= 1"
            @click="goToPage(currentPage - 1)"
        >
          Précédent
        </UButton>
        <span class="text-sm">Page {{ currentPage }} sur {{ totalPages }}</span>
        <UButton
            size="sm"
            variant="outline"
            :disabled="currentPage >= totalPages"
            @click="goToPage(currentPage + 1)"
        >
          Suivant
        </UButton>
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
import {useRouter} from 'vue-router';

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

// Router pour synchroniser le numéro de page dans l'URL
const router = useRouter();

const sortField = ref('discipline.name'); // Default sort field
const sortOrder = ref<'asc' | 'desc'>('desc'); // Default sort order

const {
  records,
  totalPages,
  currentPage,
  isLoading,
  isError,
  error,
  updateFilters,
  setPage,
  refetch
} = useRecords({
  initialFilters: {...props.initialFilters, order: {[sortField.value]: sortOrder.value}},
  initialPage: props.initialPage,
  initialPageSize: props.initialPageSize
});

// Wrapper pour refetch
const onRefetch = () => {
  refetch();
};

// Watch for external filter changes from parent
watch(() => props.initialFilters, (newFiltersFromProps) => {
  if (newFiltersFromProps) {
    // Merge external filters with current sort order
    updateFilters({
      ...newFiltersFromProps,
      order: {[sortField.value]: sortOrder.value}
    });
  }
}, {deep: true});

// Watch for internal sorting changes
watch([sortField, sortOrder], () => {
  updateFilters({
    ...props.initialFilters,
    order: {[sortField.value]: sortOrder.value}
  });
});

function showDetails(record: RecordEntity) {
  emit('show-details', record);
}

function handleSort(field: string, order: 'asc' | 'desc') {
  console.log('RecordsListCard - Réception de la demande de tri:', field, order);
  sortField.value = field;
  sortOrder.value = order;

  // Mise à jour des filtres avec les nouveaux paramètres de tri
  const newFilters = {
    ...props.initialFilters,
    order: { [field]: order }
  };

  console.log('RecordsListCard - Mise à jour des filtres:', newFilters);
  updateFilters(newFilters);
  // Forcer le rechargement des données
  refetch();
}

// Gère le changement de page et met à jour l'URL
function goToPage(page: number) {
  setPage(page);
  router.replace({query: {...router.currentRoute.value.query, page}});
}
</script>
