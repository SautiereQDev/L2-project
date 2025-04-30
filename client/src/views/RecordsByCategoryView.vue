<template>
  <div class="records-by-category">
    <h1>Records par catégorie d'âge</h1>
    
    <div class="categories-grid">
      <div v-for="category in categories" :key="category.value" class="category-card" @click="selectCategory(category.value)">
        <h2>{{ category.label }}</h2>
        <p>{{ category.description }}</p>
      </div>
    </div>
    
    <div v-if="selectedCategory" class="selected-category">
      <div class="header-with-back">
        <button class="back-button" @click="clearSelection">← Retour</button>
        <h2>Records - {{ getCategoryLabel(selectedCategory) }}</h2>
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
          <label for="gender-filter">Genre:</label>
          <select v-model="selectedGender" id="gender-filter">
            <option value="">Tous</option>
            <option value="MEN">Hommes</option>
            <option value="WOMEN">Femmes</option>
          </select>
        </div>
      </div>
      
      <div class="records-container">
        <!-- Tableau des records par catégorie -->
        <table v-if="filteredRecordsByCategory.length > 0" class="records-table">
          <thead>
            <tr>
              <th>Discipline</th>
              <th>Performance</th>
              <th>Athlète</th>
              <th>Date</th>
              <th>Genre</th>
              <th>Lieu</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in filteredRecordsByCategory" :key="record.id">
              <td>{{ record.discipline.name }}</td>
              <td>{{ formatPerformance(record.performance, record.discipline.type) }}</td>
              <td>{{ record.athlete.firstname }} {{ record.athlete.lastname }}</td>
              <td>{{ formatDate(record.lastRecord) }}</td>
              <td>{{ record.genre === 'MEN' ? 'Homme' : 'Femme' }}</td>
              <td>{{ record.location.name }}, {{ record.location.city }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="no-records">
          <p>Aucun record trouvé pour cette catégorie avec les filtres sélectionnés.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Types (identiques à ceux de RecordsByDisciplineView)
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

// Catégories d'âge avec descriptions
const categories = [
  { value: 'U18', label: 'U18', description: 'Moins de 18 ans' },
  { value: 'U20', label: 'U20', description: 'Moins de 20 ans' },
  { value: 'U23', label: 'U23', description: 'Moins de 23 ans' },
  { value: 'SENIOR', label: 'Senior', description: '23 à 35 ans' },
  { value: 'MASTER', label: 'Master', description: '35 ans et plus' }
];

// État
const records = ref<Record[]>([]);
const selectedCategory = ref('');
const selectedType = ref('');
const selectedGender = ref('');
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

// Sélection de catégorie
function selectCategory(category: string) {
  selectedCategory.value = category;
}

// Réinitialiser la sélection
function clearSelection() {
  selectedCategory.value = '';
  selectedType.value = '';
  selectedGender.value = '';
}

// Obtenir le label d'une catégorie
function getCategoryLabel(categoryValue: string) {
  const category = categories.find(cat => cat.value === categoryValue);
  return category ? category.label : categoryValue;
}

// Filtrer les records par catégorie
const filteredRecordsByCategory = computed(() => {
  return records.value.filter(record => {
    // Filtre par catégorie (obligatoire)
    if (record.categorie !== selectedCategory.value) {
      return false;
    }
    
    // Filtre par type de discipline
    if (selectedType.value && record.discipline.type !== selectedType.value) {
      return false;
    }
    
    // Filtre par genre
    if (selectedGender.value && record.genre !== selectedGender.value) {
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
.records-by-category {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #1e40af;
  margin-bottom: 2rem;
  text-align: center;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.category-card {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #dbeafe;
}

.category-card h2 {
  margin-top: 0;
  color: #1e40af;
}

.category-card p {
  margin-bottom: 0;
  color: #6b7280;
}

.selected-category {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.header-with-back {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.back-button {
  background-color: #1e40af;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 1rem;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: #1d4ed8;
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
  .filter-section {
    flex-direction: column;
  }
  
  .records-table {
    display: block;
    overflow-x: auto;
  }
}
</style>
