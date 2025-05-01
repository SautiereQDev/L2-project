<template>
  <div class="records-paginated-view">
    <h1>Records d'athlétisme</h1>
    
    <!-- Filtres -->
    <div class="filters">
      <div class="filter-group">
        <label for="discipline-type">Type de discipline:</label>
        <select id="discipline-type" v-model="filters.disciplineType">
          <option value="">Tous</option>
          <option value="run">Course</option>
          <option value="jump">Saut</option>
          <option value="throw">Lancer</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="gender">Genre:</label>
        <select id="gender" v-model="filters.gender">
          <option value="">Tous</option>
          <option value="MEN">Homme</option>
          <option value="WOMEN">Femme</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="category">Catégorie:</label>
        <select id="category" v-model="filters.category">
          <option value="">Toutes</option>
          <option value="U18">U18</option>
          <option value="U20">U20</option>
          <option value="U23">U23</option>
          <option value="SENIOR">Senior</option>
          <option value="MASTER">Master</option>
        </select>
      </div>
      
      <button @click="applyFilters" class="btn-primary">Filtrer</button>
      <button @click="resetFilters" class="btn-secondary">Réinitialiser</button>
    </div>

    <!-- Tableau des records -->
    <div class="records-container">
      <div v-if="isLoading" class="loading">
        Chargement des records...
      </div>
      
      <div v-else-if="isError" class="error">
        Une erreur s'est produite lors du chargement des records.
        <button @click="() => refetch()" class="btn-primary">Réessayer</button>
      </div>
      
      <table v-else-if="records.length > 0" class="records-table">
        <thead>
          <tr>
            <th>Discipline</th>
            <th>Type</th>
            <th>Athlète</th>
            <th>Date</th>
            <th>Performance</th>
            <th>Catégorie</th>
            <th>Genre</th>
            <th>Lieu</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in records" :key="record.id">
            <td>{{ record.discipline.name }}</td>
            <td>{{ formatDisciplineType(record.discipline.type) }}</td>
            <td>{{ record.athlete.firstname }} {{ record.athlete.lastname }}</td>
            <td>{{ formatDate(record.lastRecord) }}</td>
            <td>{{ formatPerformance(record.performance, record.discipline.type) }}</td>
            <td>{{ record.categorie }}</td>
            <td>{{ record.genre === 'MEN' ? 'Homme' : 'Femme' }}</td>
            <td>{{ record.location.name }}, {{ record.location.city }}</td>
            <td>
              <router-link :to="`/records/${record.id}`" class="btn-details">
                Détails
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="no-records">
        <p>Aucun record trouvé avec les filtres sélectionnés.</p>
      </div>
    </div>
    
    <!-- Pagination -->
    <div class="pagination">
      <button 
        @click="prevPage" 
        :disabled="!paginationInfo.hasPrevPage"
        class="pagination-btn"
      >
        &laquo; Précédent
      </button>
      
      <div class="page-info">
        Page {{ paginationInfo.currentPage }} sur {{ paginationInfo.totalPages }}
      </div>
      
      <button 
        @click="nextPage" 
        :disabled="!paginationInfo.hasNextPage"
        class="pagination-btn"
      >
        Suivant &raquo;
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {  reactive } from 'vue';
import { useRecordsPagination } from '../composables/useRecordsPagination';
import type { RecordFilters } from '@/types';
import { DisciplineType } from '@/types';

// Filtres
const filters = reactive<RecordFilters>({});

// Utilisation du composable de pagination
const { 
  records, 
  currentPage, 
  paginationInfo, 
  isLoading, 
  isError, 
  nextPage, 
  prevPage,
  goToPage,
  refetch
} = useRecordsPagination({ initialPage: 1, pageSize: 10 });

// Appliquer les filtres
function applyFilters() {
  // Réinitialiser la pagination
  goToPage(1);
  // Actualiser les données
  refetch();
}

// Réinitialiser les filtres
function resetFilters() {
  // Vider les filtres
  Object.keys(filters).forEach(key => {
    delete (filters as any)[key];
  });
  // Réinitialiser la pagination
  goToPage(1);
  // Actualiser les données
  refetch();
}

// Formater le type de discipline
function formatDisciplineType(type: DisciplineType): string {
  switch (type) {
    case DisciplineType.RUN:
      return 'Course';
    case DisciplineType.JUMP:
      return 'Saut';
    case DisciplineType.THROW:
      return 'Lancer';
    default:
      return type;
  }
}

// Formater les performances selon le type de discipline
function formatPerformance(performance: number, disciplineType: DisciplineType): string {
  if (disciplineType === DisciplineType.RUN) {
    // Format time MM:SS.MS for running events
    const minutes = Math.floor(performance / 60);
    const seconds = Math.floor(performance % 60);
    const milliseconds = Math.round((performance % 1) * 100);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  } else {
    // Format distance in meters for jumps and throws
    return `${performance.toFixed(2)} m`;
  }
}

// Formatage des dates
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}
</script>

<style scoped>
.records-paginated-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #555;
}

select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 150px;
}

.btn-primary {
  background-color: #4a6cf7;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-end;
  font-weight: 600;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #333;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-end;
  font-weight: 600;
}

.records-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.records-table th,
.records-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.records-table th {
  background-color: #f2f2f2;
  font-weight: 600;
}

.records-table tr:hover {
  background-color: #f9f9f9;
}

.loading, .error, .no-records {
  padding: 20px;
  text-align: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin: 20px 0;
}

.error {
  color: #e53e3e;
  background-color: #fed7d7;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 15px;
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

.pagination-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9rem;
  color: #666;
}

.btn-details {
  display: inline-block;
  padding: 5px 10px;
  background-color: #3182ce;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.85rem;
}

.btn-details:hover {
  background-color: #2c5282;
}
</style>
