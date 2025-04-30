<template>
  <div class="advanced-search">
    <h1>Recherche avancée de records</h1>
    
    <div class="search-form">
      <div class="filter-section">
        <div class="filter-row">
          <div class="filter-group">
            <label for="discipline-search">Discipline:</label>
            <input 
              type="text" 
              id="discipline-search" 
              v-model="searchQuery.disciplineName" 
              placeholder="Nom de la discipline..."
            />
          </div>
          
          <div class="filter-group">
            <label for="discipline-type">Type de discipline:</label>
            <select v-model="searchQuery.disciplineType" id="discipline-type">
              <option value="">Tous</option>
              <option value="run">Courses</option>
              <option value="jump">Sauts</option>
              <option value="throw">Lancers</option>
            </select>
          </div>
          
          <div class="filter-group" v-if="searchQuery.disciplineType === 'run'">
            <label for="running-type">Type de course:</label>
            <select v-model="searchQuery.runningType" id="running-type">
              <option value="">Tous</option>
              <option value="SHORT">Sprint</option>
              <option value="MIDDLE">Demi-fond</option>
              <option value="LONG">Fond</option>
            </select>
          </div>
        </div>
        
        <div class="filter-row">
          <div class="filter-group">
            <label for="athlete-search">Athlète:</label>
            <input 
              type="text" 
              id="athlete-search" 
              v-model="searchQuery.athleteName" 
              placeholder="Nom de l'athlète..."
            />
          </div>
          
          <div class="filter-group">
            <label for="country-search">Pays:</label>
            <input 
              type="text" 
              id="country-search" 
              v-model="searchQuery.country" 
              placeholder="Pays de l'athlète..."
            />
          </div>
        </div>
        
        <div class="filter-row">
          <div class="filter-group">
            <label for="gender-filter">Genre:</label>
            <select v-model="searchQuery.gender" id="gender-filter">
              <option value="">Tous</option>
              <option value="MEN">Hommes</option>
              <option value="WOMEN">Femmes</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label for="category-filter">Catégorie:</label>
            <select v-model="searchQuery.category" id="category-filter">
              <option value="">Toutes</option>
              <option value="U18">U18</option>
              <option value="U20">U20</option>
              <option value="U23">U23</option>
              <option value="SENIOR">Senior</option>
              <option value="MASTER">Master</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Année du record:</label>
            <div class="year-range">
              <input 
                type="number" 
                v-model="searchQuery.yearFrom" 
                placeholder="De" 
                min="1900" 
                :max="currentYear"
              />
              <span>-</span>
              <input 
                type="number" 
                v-model="searchQuery.yearTo" 
                placeholder="À" 
                min="1900" 
                :max="currentYear"
              />
            </div>
          </div>
        </div>
        
        <div class="button-row">
          <button class="search-button" @click="searchRecords">Rechercher</button>
          <button class="reset-button" @click="resetSearch">Réinitialiser</button>
        </div>
      </div>
    </div>
    
    <div class="search-results" v-if="hasSearched">
      <h2>Résultats de la recherche</h2>
      
      <div v-if="loading" class="loading">
        <p>Chargement des résultats...</p>
      </div>
      
      <div v-else-if="filteredRecords.length === 0" class="no-results">
        <p>Aucun record ne correspond à votre recherche.</p>
      </div>
      
      <table v-else class="records-table">
        <thead>
          <tr>
            <th>Discipline</th>
            <th>Performance</th>
            <th>Athlète</th>
            <th>Date</th>
            <th>Catégorie</th>
            <th>Genre</th>
            <th>Lieu</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in filteredRecords" :key="record.id">
            <td>{{ record.discipline.name }}</td>
            <td>{{ formatPerformance(record.performance, record.discipline.type) }}</td>
            <td>{{ record.athlete.firstname }} {{ record.athlete.lastname }}</td>
            <td>{{ formatDate(record.lastRecord) }}</td>
            <td>{{ record.categorie }}</td>
            <td>{{ record.genre === 'MEN' ? 'Homme' : 'Femme' }}</td>
            <td>{{ record.location.name }}, {{ record.location.city }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Types (identiques à ceux des autres vues)
interface Discipline {
  id: number;
  name: string;
  type: string;
  categories: string;
  runningType: string | null;
}

interface Athlete {
  id: number;
  firstname: string;
  lastname: string;
  country: string;
}

interface Location {
  id: number;
  name: string;
  city: string;
  country: string;
}

interface Record {
  id: number;
  discipline: Discipline;
  athlete: Athlete;
  lastRecord: string;
  performance: number;
  genre: string;
  categorie: string;
  location: Location;
}

interface SearchQuery {
  disciplineName: string;
  disciplineType: string;
  runningType: string;
  athleteName: string;
  country: string;
  gender: string;
  category: string;
  yearFrom: number | null;
  yearTo: number | null;
}

// État
const records = ref<Record[]>([]);
const filteredRecords = ref<Record[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const hasSearched = ref(false);
const currentYear = new Date().getFullYear();

// État de recherche
const searchQuery = ref<SearchQuery>({
  disciplineName: '',
  disciplineType: '',
  runningType: '',
  athleteName: '',
  country: '',
  gender: '',
  category: '',
  yearFrom: null,
  yearTo: null
});

// Récupérer les records depuis l'API
onMounted(async () => {
  try {
    loading.value = true;
    const response = await fetch('/api/records');
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des records');
    }
    records.value = await response.json();
    loading.value = false;
  } catch (err: any) {
    error.value = err.message;
    console.error('Erreur:', err);
    loading.value = false;
  }
});

// Rechercher des records
function searchRecords() {
  loading.value = true;
  hasSearched.value = true;
  
  setTimeout(() => {
    filteredRecords.value = records.value.filter(record => {
      // Filtre par nom de discipline
      if (searchQuery.value.disciplineName && 
          !record.discipline.name.toLowerCase().includes(searchQuery.value.disciplineName.toLowerCase())) {
        return false;
      }
      
      // Filtre par type de discipline
      if (searchQuery.value.disciplineType && 
          record.discipline.type !== searchQuery.value.disciplineType) {
        return false;
      }
      
      // Filtre par type de course (si applicable)
      if (searchQuery.value.disciplineType === 'run' && 
          searchQuery.value.runningType && 
          record.discipline.runningType !== searchQuery.value.runningType) {
        return false;
      }
      
      // Filtre par nom d'athlète
      if (searchQuery.value.athleteName) {
        const fullName = `${record.athlete.firstname} ${record.athlete.lastname}`.toLowerCase();
        if (!fullName.includes(searchQuery.value.athleteName.toLowerCase())) {
          return false;
        }
      }
      
      // Filtre par pays
      if (searchQuery.value.country && 
          !record.athlete.country.toLowerCase().includes(searchQuery.value.country.toLowerCase())) {
        return false;
      }
      
      // Filtre par genre
      if (searchQuery.value.gender && record.genre !== searchQuery.value.gender) {
        return false;
      }
      
      // Filtre par catégorie
      if (searchQuery.value.category && record.categorie !== searchQuery.value.category) {
        return false;
      }
      
      // Filtre par année
      if (searchQuery.value.yearFrom || searchQuery.value.yearTo) {
        const recordYear = new Date(record.lastRecord).getFullYear();
        
        if (searchQuery.value.yearFrom && recordYear < searchQuery.value.yearFrom) {
          return false;
        }
        
        if (searchQuery.value.yearTo && recordYear > searchQuery.value.yearTo) {
          return false;
        }
      }
      
      return true;
    });
    
    loading.value = false;
  }, 500); // Ajout d'un petit délai pour simuler une recherche
}

// Réinitialiser la recherche
function resetSearch() {
  searchQuery.value = {
    disciplineName: '',
    disciplineType: '',
    runningType: '',
    athleteName: '',
    country: '',
    gender: '',
    category: '',
    yearFrom: null,
    yearTo: null
  };
  filteredRecords.value = [];
  hasSearched.value = false;
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
.advanced-search {
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
  margin-bottom: 2rem;
}

.filter-section {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4b5563;
}

.filter-group input, .filter-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: white;
  font-size: 1rem;
}

.year-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.year-range input {
  flex: 1;
}

.button-row {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.search-button, .reset-button {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.search-button {
  background-color: #1e40af;
  color: white;
}

.search-button:hover {
  background-color: #1d4ed8;
}

.reset-button {
  background-color: #e5e7eb;
  color: #4b5563;
}

.reset-button:hover {
  background-color: #d1d5db;
}

.loading, .no-results {
  text-align: center;
  padding: 2rem;
  background-color: #f8fafc;
  border-radius: 8px;
  color: #6b7280;
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
  
  .button-row {
    justify-content: center;
  }
  
  .records-table {
    display: block;
    overflow-x: auto;
  }
}
</style>
