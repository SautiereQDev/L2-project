<template>
  <div class="records-search">
    <h1>Recherche Avancée de Records</h1>
    
    <div class="search-form">
      <div class="search-filter-section">
        <div class="filter-row">
          <div class="filter-group">
            <label for="discipline-type">Type de discipline</label>
            <select 
              id="discipline-type" 
              v-model="searchFilters.disciplineType"
              @change="updateFilter('disciplineType', searchFilters.disciplineType)"
            >
              <option value="">Toutes les disciplines</option>
              <option value="run">Courses</option>
              <option value="jump">Sauts</option>
              <option value="throw">Lancers</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="gender">Genre</label>
            <select 
              id="gender" 
              v-model="searchFilters.gender"
              @change="updateFilter('gender', searchFilters.gender)"
            >
              <option value="">Tous les genres</option>
              <option value="MEN">Hommes</option>
              <option value="WOMEN">Femmes</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="category">Catégorie d'âge</label>
            <select 
              id="category" 
              v-model="searchFilters.category"
              @change="updateFilter('category', searchFilters.category)"
            >
              <option value="">Toutes les catégories</option>
              <option value="U18">U18</option>
              <option value="U20">U20</option>
              <option value="U23">U23</option>
              <option value="SENIOR">Senior</option>
              <option value="MASTER">Master</option>
            </select>
          </div>
        </div>
        
        <div class="filter-row">
          <div class="filter-group">
            <label for="athlete-name">Nom de l'athlète</label>
            <input 
              type="text" 
              id="athlete-name" 
              v-model="searchFilters.athleteName" 
              placeholder="Ex: Usain Bolt"
              @input="updateFilter('athleteName', searchFilters.athleteName)"
            />
          </div>
          
          <div class="filter-group">
            <label for="country">Pays</label>
            <input 
              type="text" 
              id="country" 
              v-model="searchFilters.country"
              placeholder="Ex: France" 
              @input="updateFilter('country', searchFilters.country)"
            />
          </div>
        </div>
        
        <div class="filter-row">
          <div class="filter-group">
            <label for="year-from">Année (de)</label>
            <input 
              type="number" 
              id="year-from" 
              v-model.number="searchFilters.yearFrom" 
              min="1900" 
              :max="currentYear"
              @input="updateFilter('yearFrom', searchFilters.yearFrom)"
            />
          </div>
          
          <div class="filter-group">
            <label for="year-to">Année (à)</label>
            <input 
              type="number" 
              id="year-to" 
              v-model.number="searchFilters.yearTo" 
              min="1900" 
              :max="currentYear"
              @input="updateFilter('yearTo', searchFilters.yearTo)"
            />
          </div>
        </div>
        
        <div class="search-buttons">
          <button class="primary-button" @click="executeSearch">Rechercher</button>
          <button class="secondary-button" @click="clearAllFilters">Effacer les filtres</button>
        </div>
      </div>
    </div>
    
    <!-- Résultats de recherche -->
    <div v-if="isPending" class="loading-state">
      <div class="spinner"></div>
      <p>Recherche des records en cours...</p>
    </div>
    
    <div v-else-if="isError" class="error-state">
      <p>Une erreur est survenue: {{ error }}</p>
      <button class="secondary-button" @click="() => refetch()">Réessayer</button>
    </div>
    
    <div v-else-if="data && data.length > 0" class="search-results">
      <h2>Résultats ({{ data.length }} records trouvés)</h2>
      
      <table class="records-table">
        <thead>
          <tr>
            <th>Discipline</th>
            <th>Performance</th>
            <th>Athlète</th>
            <th>Date</th>
            <th>Genre</th>
            <th>Catégorie</th>
            <th>Lieu</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in data" :key="record.id">
            <td>{{ record.discipline.name }}</td>
            <td>{{ formatPerformance(record.performance, record.discipline.type) }}</td>
            <td>{{ record.athlete.firstname }} {{ record.athlete.lastname }}</td>
            <td>{{ formatDate(record.lastRecord) }}</td>
            <td>{{ record.genre === 'MEN' ? 'Homme' : 'Femme' }}</td>
            <td>{{ getCategoryLabel(record.categorie) }}</td>
            <td>{{ record.location.name }}, {{ record.location.city }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-else-if="isSuccess && (!data || data.length === 0)" class="no-results">
      <p>Aucun record ne correspond à votre recherche.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRecordsSearch } from '@/composables/useRecordsSearch';
import type { RecordFilters } from '@/types/record.types';

// Année courante pour les filtres
const currentYear = new Date().getFullYear();

// État local pour les filtres de recherche
const searchFilters = ref<RecordFilters>({
  disciplineType: '',
  gender: '',
  category: '',
  athleteName: '',
  country: '',
  yearFrom: undefined,
  yearTo: undefined
});

// Utiliser notre hook de recherche de records
const {
  filters,
  updateFilter,
  clearFilters,
  executeSearch,
  data,
  isPending,
  isError,
  error,
  isSuccess,
  refetch
} = useRecordsSearch();

// Fonction pour effacer tous les filtres
function clearAllFilters() {
  searchFilters.value = {
    disciplineType: '',
    gender: '',
    category: '',
    athleteName: '',
    country: '',
    yearFrom: undefined,
    yearTo: undefined
  };
  clearFilters();
}

// Obtenir le label d'une catégorie
function getCategoryLabel(category: string): string {
  const categoryLabels: Record<string, string> = {
    'U18': 'Moins de 18 ans',
    'U20': 'Moins de 20 ans',
    'U23': 'Moins de 23 ans',
    'SENIOR': 'Senior',
    'MASTER': 'Master'
  };
  
  return categoryLabels[category] || category;
}

// Formatage des performances selon le type de discipline
function formatPerformance(performance: number, disciplineType: string): string {
  if (disciplineType === 'run') {
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
.records-search {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #1e40af;
  margin-bottom: 2rem;
  text-align: center;
}

h2 {
  color: #1e40af;
  margin: 2rem 0 1rem;
}

.search-form {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.search-filter-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-group {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
}

.filter-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4b5563;
}

.filter-group select, .filter-group input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
}

.search-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.primary-button {
  background-color: #1e40af;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.primary-button:hover {
  background-color: #1d4ed8;
}

.secondary-button {
  background-color: white;
  color: #1e40af;
  border: 1px solid #1e40af;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.secondary-button:hover {
  background-color: #f0f9ff;
}

.loading-state, .error-state, .no-results {
  padding: 3rem 0;
  text-align: center;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(30, 64, 175, 0.2);
  border-radius: 50%;
  border-top-color: #1e40af;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state {
  color: #ef4444;
}

.records-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.records-table th, .records-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.records-table th {
  background-color: #1e40af;
  color: white;
  font-weight: 500;
}

.records-table tr:nth-child(even) {
  background-color: #f8fafc;
}

.records-table tr:hover {
  background-color: #dbeafe;
}

@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
  }
  
  .records-table {
    display: block;
    overflow-x: auto;
  }
}
</style>
