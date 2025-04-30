<template>
  <div class="records-by-genre">
    <h1>Records par sexe</h1>
    
    <div class="genre-selector">
      <div 
        class="genre-card" 
        :class="{ 'active': selectedGender === 'MEN' }" 
        @click="selectGender('MEN')">
        <div class="genre-icon">♂</div>
        <h2>Hommes</h2>
        <p>Tous les records masculins</p>
      </div>
      
      <div 
        class="genre-card" 
        :class="{ 'active': selectedGender === 'WOMEN' }"
        @click="selectGender('WOMEN')">
        <div class="genre-icon">♀</div>
        <h2>Femmes</h2>
        <p>Tous les records féminins</p>
      </div>
    </div>
    
    <div v-if="selectedGender" class="selected-gender-records">
      <div class="header-with-clear">
        <h2>Records - {{ selectedGender === 'MEN' ? 'Hommes' : 'Femmes' }}</h2>
        <button class="clear-button" @click="clearSelection">Effacer les filtres</button>
      </div>
      
      <div class="filter-section">
        <div class="filter-group">
          <label for="discipline-type">Type de discipline:</label>
          <select v-model="selectedType" id="discipline-type">
            <option value="">Toutes les disciplines</option>
            <option value="run">Courses</option>
            <option value="jump">Sauts</option>
            <option value="throw">Lancers</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="category-filter">Catégorie:</label>
          <select v-model="selectedCategory" id="category-filter">
            <option value="">Toutes</option>
            <option value="U18">U18</option>
            <option value="U20">U20</option>
            <option value="U23">U23</option>
            <option value="SENIOR">Senior</option>
            <option value="MASTER">Master</option>
          </select>
        </div>
      </div>
      
      <div class="records-container">
        <!-- Tableau des records par genre -->
        <table v-if="filteredRecordsByGender.length > 0" class="records-table">
          <thead>
            <tr>
              <th>Discipline</th>
              <th>Performance</th>
              <th>Athlète</th>
              <th>Date</th>
              <th>Catégorie</th>
              <th>Lieu</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in filteredRecordsByGender" :key="record.id">
              <td>{{ record.discipline.name }}</td>
              <td>{{ formatPerformance(record.performance, record.discipline.type) }}</td>
              <td>{{ record.athlete.firstname }} {{ record.athlete.lastname }}</td>
              <td>{{ formatDate(record.lastRecord) }}</td>
              <td>{{ record.categorie }}</td>
              <td>{{ record.location.name }}, {{ record.location.city }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="no-records">
          <p>Aucun record trouvé pour ce sexe avec les filtres sélectionnés.</p>
        </div>
      </div>
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

// État
const records = ref<Record[]>([]);
const selectedGender = ref('');
const selectedType = ref('');
const selectedCategory = ref('');
const loading = ref(false);
const error = ref<string | null>(null);

// Récupérer les records depuis l'API
onMounted(async () => {
  try {
    loading.value = true;
    const response = await fetch('/api/records');
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des records');
    }
    records.value = await response.json();
  } catch (err: any) {
    error.value = err.message;
    console.error('Erreur:', err);
  } finally {
    loading.value = false;
  }
});

// Sélection de genre
function selectGender(gender: string) {
  selectedGender.value = gender;
}

// Réinitialiser les filtres
function clearSelection() {
  selectedGender.value = '';
  selectedType.value = '';
  selectedCategory.value = '';
}

// Filtrer les records par genre
const filteredRecordsByGender = computed(() => {
  return records.value.filter(record => {
    // Filtre par genre (obligatoire)
    if (record.genre !== selectedGender.value) {
      return false;
    }
    
    // Filtre par type de discipline
    if (selectedType.value && record.discipline.type !== selectedType.value) {
      return false;
    }
    
    // Filtre par catégorie
    if (selectedCategory.value && record.categorie !== selectedCategory.value) {
      return false;
    }
    
    return true;
  });
});

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
.records-by-genre {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #1e40af;
  margin-bottom: 2rem;
  text-align: center;
}

.genre-selector {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.genre-card {
  flex: 1;
  max-width: 300px;
  background-color: #f8fafc;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.genre-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.genre-card.active {
  background-color: #dbeafe;
  border: 2px solid #1e40af;
}

.genre-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #1e40af;
}

.genre-card h2 {
  margin-top: 0;
  color: #1e40af;
  font-size: 1.5rem;
}

.genre-card p {
  margin-bottom: 0;
  color: #6b7280;
}

.selected-gender-records {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.header-with-clear {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.clear-button {
  background-color: #e5e7eb;
  color: #4b5563;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.clear-button:hover {
  background-color: #d1d5db;
}

.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background-color: #f8fafc;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

.filter-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background-color: white;
  font-size: 1rem;
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

.no-records {
  text-align: center;
  padding: 3rem;
  background-color: #f8fafc;
  border-radius: 8px;
  color: #6b7280;
}

@media (max-width: 768px) {
  .genre-selector {
    flex-direction: column;
    align-items: center;
  }
  
  .genre-card {
    width: 100%;
    max-width: 100%;
    margin-bottom: 1rem;
  }
  
  .filter-section {
    flex-direction: column;
  }
  
  .records-table {
    display: block;
    overflow-x: auto;
  }
}
</style>
