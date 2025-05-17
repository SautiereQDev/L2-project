<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center">
        <h3 class="text-base font-semibold">Liste des records</h3>
        <UBadge :color="loading ? 'warning' : 'success'" class="ml-2">
          {{ loading ? 'Chargement...' : totalItems + ' records' }}
        </UBadge>
      </div>
    </template>

    <!-- États du tableau -->
    <!-- États du tableau -->
    <div class="min-h-[400px]">
      <!-- Affichage du chargement -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-12">
        <Spinner class="mb-4"/>
        <p class="text-sm text-gray-500">Chargement des records...</p>
      </div>

      <!-- Affichage des erreurs -->
      <div v-else-if="isError" class="flex flex-col items-center justify-center py-6">
        <UAlert
            :title="'Erreur de chargement'"
            :description="error?.message ?? 'Une erreur est survenue lors du chargement des records.'"
            color="error"
            variant="soft"
            icon="i-heroicons-exclamation-circle"
            class="mb-4 max-w-md"
        />
        <UButton color="primary" icon="i-heroicons-arrow-path" @click="refetch">
          Réessayer
        </UButton>
      </div>

      <!-- Tableau des records -->
      <div v-else>
        <RecordsTable
            :records="records"
            :sort-field="sortField"
            :sort-order="sortOrder"
            @show-details="showDetails"
            @update:sort="handleSort"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalItems > 0" class="flex justify-center mt-4">
        <Paginator
            :first="(props.currentPage - 1) * 10"
            :rows="10"
            :totalRecords="totalItems"
            :template="`FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink`"
            @page="onPage"
            class="py-4"
        />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import Spinner from './ui/Spinner.vue';
import RecordsTable from './RecordsTable.vue';
import {computed} from 'vue';
import type {RecordEntity} from '~/types';

const props = defineProps({
  /**
   * Les records à afficher dans le tableau
   */
  records: {
    type: Array as () => RecordEntity[],
    required: true
  },
  /**
   * Indique si les données sont en cours de chargement
   */
  loading: {
    type: Boolean,
    default: false
  },
  /**
   * Indique s'il y a eu une erreur lors du chargement
   */
  isError: {
    type: Boolean,
    default: false
  },
  /**
   * Message d'erreur éventuel
   */
  error: {
    type: Object as () => Error | null,
    default: null
  },
  /**
   * Champ de tri actuel
   */
  sortField: {
    type: String,
    default: 'discipline.name'
  },
  /**
   * Ordre de tri actuel
   */
  sortOrder: {
    type: String as () => 'asc' | 'desc',
    default: 'desc'
  },
  /**
   * Nombre total d'éléments
   */
  totalItems: {
    type: Number,
    required: true
  },
  /**
   * Nombre total de pages
   */
  totalPages: {
    type: Number,
    required: true
  },
  /**
   * Page actuelle
   */
  currentPage: {
    type: Number,
    default: 1
  }
});

const emit = defineEmits(['refetch', 'update:sort', 'update:page', 'show-details']);

function onPage(event: { page: number; rows: number }) {
  emit('update:page', event.page + 1);
}

// Fonction pour réessayer en cas d'erreur
function refetch() {
  emit('refetch');
}

// Fonction pour afficher les détails d'un record
function showDetails(record: RecordEntity) {
  emit('show-details', record);
}

// Fonction pour gérer le tri
function handleSort(field: string, order: 'asc' | 'desc') {
  emit('update:sort', field, order);
}
</script>