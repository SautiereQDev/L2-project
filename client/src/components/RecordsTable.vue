<template>
<table v-if="records.length > 0" class="w-full border-collapse">
    <thead>
      <tr>
        <th scope="col" class="border border-gray-300 p-2 bg-gray-100 cursor-pointer" @click="onSort('discipline.name')">
          Discipline
          <span v-if="sortField === 'discipline.name'" class="sort-icon">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
        </th>
        <th scope="col" class="border border-gray-300 p-2 bg-gray-100 cursor-pointer" @click="onSort('performance')">
          Performance
          <span v-if="sortField === 'performance'" class="sort-icon">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
        </th>
        <th scope="col" class="border border-gray-300 p-2 bg-gray-100 cursor-pointer" @click="onSort('athlete.lastname')">
          Athlète
          <span v-if="sortField === 'athlete.lastname'" class="sort-icon">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
        </th>
        <th scope="col" class="border border-gray-300 p-2 bg-gray-100 cursor-pointer" @click="onSort('lastRecord')">
          Date
          <span v-if="sortField === 'lastRecord'" class="sort-icon">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
        </th>
        <th scope="col" class="border border-gray-300 p-2 bg-gray-100 cursor-pointer" @click="onSort('categorie')">
          Catégorie
          <span v-if="sortField === 'categorie'" class="sort-icon">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
        </th>
        <th scope="col" class="border border-gray-300 p-2 bg-gray-100 cursor-pointer" @click="onSort('genre')">
          Genre
          <span v-if="sortField === 'genre'" class="sort-icon">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
        </th>
        <th scope="col" class="border border-gray-300 p-2">Lieu</th>
        <th scope="col" class="border border-gray-300 p-2">Actions</th>
      </tr>
    </thead>
      <tbody>
      <tr v-for="record in records" :key="record.id">
        <td data-label="Discipline" class="border border-gray-300 p-2">{{ record.discipline.name }}</td>
        <td data-label="Performance" class="border border-gray-300 p-2">{{ formatPerformance(record.performance, record.discipline.type) }}</td>
        <td data-label="Athlète" class="border border-gray-300 p-2">{{ record.athlete.firstname }} {{ record.athlete.lastname }}</td>
        <td data-label="Date" class="border border-gray-300 p-2">{{ formatDate(record.lastRecord) }}</td>
        <td data-label="Catégorie" class="border border-gray-300 p-2">{{ record.categorie }}</td>
        <td data-label="Genre" class="border border-gray-300 p-2">{{ record.genre === 'M' ? 'Homme' : 'Femme' }}</td>
        <td data-label="Lieu" class="border border-gray-300 p-2">{{ record.location.name }}, {{ record.location.city }}</td>
        <td data-label="Actions" class="border border-gray-300 p-2">
          <button class="mr-2 py-2 px-4 cursor-pointer" @click="onShow(record)">Détails</button>
          <router-link :to="`/records/${record.id}`" class="text-blue-600 hover:underline">Voir</router-link>
        </td>
      </tr>
      </tbody>
    <tfoot>
      <tr>
        <td colspan="8">
          <div class="pagination">
            <button
              class="pagination-button"
              :disabled="currentPage === 1"
              @click="onPage(currentPage - 1)"
            >&laquo; Précédent</button>
            <span class="pagination-info">Page {{ currentPage }} sur {{ totalPages }}</span>
            <button
              class="pagination-button"
              :disabled="currentPage >= totalPages"
              @click="onPage(currentPage + 1)"
            >Suivant &raquo;</button>
          </div>
        </td>
      </tr>
    </tfoot>
  </table>
  <div v-else class="no-records">
    <p>Aucun record trouvé.</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { RecordEntity } from '@/types';

const props = defineProps<{
  records: RecordEntity[];
  currentPage: number;
  totalPages: number;
  sortField: string;
  sortOrder: 'asc' | 'desc';
}>();

const emit = defineEmits<{
  (e: 'update:page', page: number): void;
  (e: 'update:sort', field: string): void;
  (e: 'show-details', record: RecordEntity): void;
}>();

function onPage(page: number) {
  emit('update:page', page);
}

function onSort(field: string) {
  emit('update:sort', field);
}

function onShow(record: RecordEntity) {
  emit('show-details', record);
}

// Helpers
function formatPerformance(performance: number, type: string): string {
  // reuse logic from view
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
