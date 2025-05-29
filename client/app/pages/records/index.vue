<template>
  <UContainer>
    <div>
      <h1>Records d'Athlétisme</h1>
      <p>
        Consultez les records d'athlétisme classés par discipline, genre et
        catégorie
      </p>
      <Icon
        name="heroicons-outline:trophy"
        class="w-6 h-6 text-primary-500 dark:text-primary-400"
      />
    </div>

    <!-- Composant de filtres -->
    <RecordsFilter
      :model-value="filters"
      :visible="showFilters"
      @update:model-value="changeFilters"
      @update:visible="showFilters = $event"
    />

    <!-- Composant liste des records -->
    <RecordsListCard
      :initial-filters="filters"
      :initial-page="initialPage"
      @show-details="showRecordDetails"
    />
  </UContainer>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, reactive, computed } from "vue";
import RecordsFilter from "@/components/RecordsFilter.vue";
import RecordsListCard from "@/components/RecordsListCard.vue";
import type { RecordFilters, RecordEntity } from "~/types";

const route = useRoute();

// Affichage des filtres
const showFilters = ref(true);

// Modal de détails
const modalOpen = ref(false);
const selectedRecord = ref<RecordEntity | null>(null);

// Initialisation des filtres
const filters = reactive<RecordFilters>({});

// Page initiale basée sur la route
const initialPage = computed(() => Number(route.query.page) || 1);

// Mettre à jour les filtres depuis le composant de filtres
function changeFilters(newFilters: RecordFilters) {
  Object.assign(filters, newFilters); // assign conserve la réactivité
}

// Afficher détails d'un record
function showRecordDetails(record: RecordEntity) {
  modalOpen.value = true;
  selectedRecord.value = record;
}
</script>
