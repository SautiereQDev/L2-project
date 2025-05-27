<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-800">
      <tr>
        <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
            @click="sort('discipline.name')"
        >
          <div class="flex items-center">
            <span>Discipline</span>
            <UIcon
                v-if="currentSortField === 'discipline.name'"
                :name="sortIcon"
                class="ml-1 h-4 w-4"
            />
          </div>
        </th>
        <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
            @click="sort('performance')"
        >
          <div class="flex items-center">
            <span>Performance</span>
            <UIcon
                v-if="currentSortField === 'performance'"
                :name="sortIcon"
                class="ml-1 h-4 w-4"
            />
          </div>
        </th>
        <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
            @click="sort('athlete.lastname')"
        >
          <div class="flex items-center">
            <span>Athlète</span>
            <UIcon
                v-if="currentSortField === 'athlete.lastname'"
                :name="sortIcon"
                class="ml-1 h-4 w-4"
            />
          </div>
        </th>
        <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
            @click="sort('lastRecord')"
        >
          <div class="flex items-center">
            <span>Date</span>
            <UIcon
                v-if="currentSortField === 'lastRecord'"
                :name="sortIcon"
                class="ml-1 h-4 w-4"
            />
          </div>
        </th>
        <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
            @click="sort('categorie')"
        >
          <div class="flex items-center">
            <span>Catégorie</span>
            <UIcon
                v-if="currentSortField === 'categorie'"
                :name="sortIcon"
                class="ml-1 h-4 w-4"
            />
          </div>
        </th>
        <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
            @click="sort('genre')"
        >
          <div class="flex items-center">
            <span>Genre</span>
            <UIcon
                v-if="currentSortField === 'genre'"
                :name="sortIcon"
                class="ml-1 h-4 w-4"
            />
          </div>
        </th>
        <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
            @click="sort('location.name')"
        >
          <div class="flex items-center">
            <span>Lieu</span>
            <UIcon
                v-if="currentSortField === 'location.name'"
                :name="sortIcon"
                class="ml-1 h-4 w-4"
            />
          </div>
        </th>
        <th
scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <div class="flex items-center">
            <span>Actions</span>
          </div>
        </th>
      </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
      <tr v-for="record in records" :key="record.id" class="hover:bg-gray-100 dark:hover:bg-gray-800">
        <td class="px-6 py-4 whitespace-nowrap">
          {{ record.discipline.name }}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span :class="{ 'text-primary-500': record.isCurrentRecord }" class="font-mono">
              {{ formatPerformance(record.performance, record.discipline.type) }}
            </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex flex-col">
            <span class="font-medium">{{ record.athlete.lastname }}</span>
            <span class="text-gray-500 dark:text-gray-400 text-sm">{{ record.athlete.firstname }}</span>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          {{ formatDate(record.lastRecord) }}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
              {{ record.categorie }}
            </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span
v-if="record.genre === 'M'"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Homme
            </span>
          <span
v-else
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
              Femme
            </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          {{ record.location.name }}, {{ record.location.city }}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium ">
          <NuxtLink
:to="`/records/${record.id}`"
                    class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
            Voir
          </NuxtLink>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import type {RecordEntity} from '../types';

interface Props {
  records: RecordEntity[];
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

const props = withDefaults(defineProps<Props>(), {
  sortField: 'discipline.name',
  sortOrder: 'asc'
});

const emit = defineEmits(['show-details', 'update:sort']);

// État local du tri
const currentSortField = ref(props.sortField);
const currentSortOrder = ref<'asc' | 'desc'>(props.sortOrder);

// Icône de tri basée sur l'ordre de tri actuel
const sortIcon = computed(() => {
  return currentSortOrder.value === 'asc'
      ? 'i-heroicons-arrow-up'
      : 'i-heroicons-arrow-down';
});

// Méthodes
function onShow(record: RecordEntity) {
  emit('show-details', record);
}

function sort(field: string) {
  // Si on clique sur le même champ, on inverse l'ordre de tri
  if (field === currentSortField.value) {
    currentSortOrder.value = currentSortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    // Sinon, on trie par le nouveau champ dans l'ordre ascendant par défaut
    currentSortField.value = field;
    currentSortOrder.value = 'asc';
  }

  // Émettre l'événement de tri
  emit('update:sort', currentSortField.value, currentSortOrder.value);
}

function formatPerformance(performance: number, type: string): string {
  if (type === 'run') {
    const minutes = Math.floor(performance / 60);
    const seconds = Math.floor(performance % 60);
    const ms = Math.round((performance % 1) * 100);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }
  return `${performance.toFixed(2)} m`;
}

function formatDate(dateString: string): string {
  const d = new Date(dateString);
  return d.toLocaleDateString('fr-FR');
}
</script>
