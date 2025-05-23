<template>
  <div class="records-view">
    <h1>Records d'Athlétisme</h1>
    
    <div class="filter-section">
      <!-- Types de disciplines -->
      <div class="filter-group">
        <label for="discipline-type">Type de discipline:</label>
        <select v-model="filters.disciplineType" id="discipline-type" @change="applyFilters">
          <option value="">Toutes les disciplines</option>
          <option value="run">Courses</option>
          <option value="jump">Sauts</option>
          <option value="throw">Lancers</option>
        </select>
      </div>
      
      <!-- Genres -->
      <div class="filter-group">
        <label for="gender-filter">Genre:</label>
        <select v-model="filters.gender" id="gender-filter" @change="applyFilters">
          <option value="">Tous</option>
          <option value="MEN">Hommes</option>
          <option value="WOMEN">Femmes</option>
        </select>
      </div>
      
      <!-- Catégories -->
      <div class="filter-group">
        <label for="category-filter">Catégorie:</label>
        <select v-model="filters.category" id="category-filter" @change="applyFilters">
          <option value="">Toutes</option>
          <option value="U18">U18</option>
          <option value="U20">U20</option>
          <option value="U23">U23</option>
          <option value="SENIOR">Senior</option>
          <option value="MASTER">Master</option>
        </select>
      </div>
      
      <!-- Recherche par athlète -->
      <div class="filter-group">
        <label for="athlete-name">Nom d'athlète:</label>
        <input 
          type="text" 
          id="athlete-name" 
          v-model="filters.athleteName" 
          placeholder="Rechercher un athlète"
          @input="debouncedFilterChange"
        />
      </div>
      
      <!-- Période (années) -->
      <div class="filter-group">
        <label for="year-from">Année (de):</label>
        <input 
          type="number" 
          id="year-from" 
          v-model.number="filters.yearFrom" 
          placeholder="Ex: 2020"
          min="1900"
          :max="currentYear"
          @change="applyFilters"
        />
      </div>
      
      <div class="filter-group">
        <label for="year-to">Année (à):</label>
        <input 
          type="number" 
          id="year-to" 
          v-model.number="filters.yearTo" 
          placeholder="Ex: 2025"
          :min="filters.yearFrom || 1900"
          :max="currentYear"
          @change="applyFilters"
        />
      </div>
      
      <!-- Boutons d'action -->
      <div class="filter-actions">
        <button @click="applyFilters" class="btn-primary">Appliquer</button>
        <button @click="resetFilters" class="btn-secondary">Réinitialiser</button>
      </div>
    </div>
    
    <!-- Conteneur des records -->
    <div class="records-container">
      <!-- Affichage du chargement -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Chargement des records...</p>
      </div>
      
      <!-- Affichage des erreurs -->
      <div v-else-if="isError" class="error">
        <p>Erreur lors du chargement des records: {{ error?.message || 'Erreur inconnue' }}</p>
        <button @click="() => refetch()" class="retry-button">Réessayer</button>
      </div>
      
      <!-- Tableau des records -->
      <div v-else class="table-responsive">
        <table v-if="records && records.length > 0" class="records-table">
          <thead>
            <tr>
              <th scope="col" @click="sortBy('discipline.name')">
                Discipline
                <span v-if="sortField === 'discipline.name'" class="sort-icon">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th scope="col" @click="sortBy('performance')">
                Performance
                <span v-if="sortField === 'performance'" class="sort-icon">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th scope="col" @click="sortBy('athlete.lastname')">
                Athlète
                <span v-if="sortField === 'athlete.lastname'" class="sort-icon">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th scope="col" @click="sortBy('lastRecord')">
                Date
                <span v-if="sortField === 'lastRecord'" class="sort-icon">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th scope="col" @click="sortBy('categorie')">
                Catégorie
                <span v-if="sortField === 'categorie'" class="sort-icon">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th scope="col" @click="sortBy('genre')">
                Genre
                <span v-if="sortField === 'genre'" class="sort-icon">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
              </th>
              <th scope="col">Lieu</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in sortedRecords" :key="record.id">
              <td data-label="Discipline">{{ record.discipline.name }}</td>
              <td data-label="Performance">{{ formatPerformance(record.performance, record.discipline.type) }}</td>
              <td data-label="Athlète">{{ record.athlete.firstname }} {{ record.athlete.lastname }}</td>
              <td data-label="Date">{{ formatDate(record.lastRecord) }}</td>
              <td data-label="Catégorie">{{ record.categorie }}</td>
              <td data-label="Genre">{{ record.genre === 'MEN' ? 'Homme' : 'Femme' }}</td>
              <td data-label="Lieu">{{ record.location.name }}, {{ record.location.city }}</td>
              <td data-label="Actions">
                <button class="btn-action" @click="showRecordDetails(record)">Détails</button>
                <router-link :to="`/records/${record.id}`" class="btn-link">Voir</router-link>
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
                    @click="changePage(currentPage - 1)"
                  >
                    &laquo; Précédent
                  </button>
                  
                  <span class="pagination-info">Page {{ currentPage }} sur {{ totalPages }}</span>
                  
                  <button 
                    class="pagination-button"
                    :disabled="currentPage >= totalPages"
                    @click="changePage(currentPage + 1)"
                  >
                    Suivant &raquo;
                  </button>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
        <div v-else class="no-records">
          <p>Aucun record trouvé avec les filtres sélectionnés.</p>
        </div>
      </div>
    </div>
    
    <!-- Modal pour les détails -->
    <div v-if="selectedRecord" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <span class="close-button" @click="closeModal">&times;</span>
        <h2>Détails du record</h2>
        <div class="record-details">
          <div class="record-detail-item">
            <span class="label">Discipline:</span>
            <span class="value">{{ selectedRecord.discipline.name }}</span>
          </div>
          <div class="record-detail-item">
            <span class="label">Type:</span>
            <span class="value">{{ formatDisciplineType(selectedRecord.discipline.type) }}</span>
          </div>
          <div class="record-detail-item">
            <span class="label">Performance:</span>
            <span class="value">{{ formatPerformance(selectedRecord.performance, selectedRecord.discipline.type) }}</span>
          </div>
          <div class="record-detail-item">
            <span class="label">Athlète:</span>
            <span class="value">{{ selectedRecord.athlete.firstname }} {{ selectedRecord.athlete.lastname }}</span>
          </div>
          <div class="record-detail-item">
            <span class="label">Pays:</span>
            <span class="value">{{ selectedRecord.athlete.country }}</span>
          </div>
          <div class="record-detail-item">
            <span class="label">Date de naissance:</span>
            <span class="value">{{ formatDate(selectedRecord.athlete.birthdate) }}</span>
          </div>
          <div class="record-detail-item">
            <span class="label">Date du record:</span>
            <span class="value">{{ formatDate(selectedRecord.lastRecord) }}</span>
          </div>
          <div class="record-detail-item">
            <span class="label">Lieu:</span>
            <span class="value">{{ selectedRecord.location.name }}, {{ selectedRecord.location.city }}, {{ selectedRecord.location.country }}</span>
          </div>
          <div class="record-detail-item">
            <span class="label">Record en cours:</span>
            <span class="value">{{ selectedRecord.isCurrentRecord ? 'Oui' : 'Non' }}</span>
          </div>
          
          <div class="modal-actions">
            <router-link :to="`/records/${selectedRecord.id}`" class="btn-primary">
              Voir la page détaillée
            </router-link>
            <button @click="closeModal" class="btn-secondary">Fermer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { useRoute, useRouter } from 'vue-router';
import type { RecordFilters, RecordEntity, GenderType, CategorieType } from '../types';
import { DisciplineType } from '../types';
import { debounce } from '../utils/debounce';
import authService from '../services/auth.service';
import recordsService from '../services/records.service';

// Récupérer la route pour extraire les paramètres d'URL
const route = useRoute();
const router = useRouter();

// Année courante pour les filtres de date
const currentYear = new Date().getFullYear();

// État de pagination
const currentPage = ref(1);
const pageSize = ref(10);
const totalRecords = ref(0);
const totalPages = computed(() => Math.ceil(totalRecords.value / pageSize.value));

// État de tri
const sortField = ref<string>('lastRecord');
const sortOrder = ref<'asc' | 'desc'>('desc');

// État de filtre - initialiser avec des valeurs vides
const filters = reactive<RecordFilters>({
  disciplineType: undefined,
  gender: undefined,
  category: undefined,
  athleteName: '',
  yearFrom: undefined,
  yearTo: undefined,
  page: currentPage.value,
  itemsPerPage: pageSize.value,
  order: { [sortField.value]: sortOrder.value }
});

// État de sélection pour les détails
const selectedRecord = ref<RecordEntity | null>(null);

// S'authentifier avant de charger les données
const isAuthenticated = ref(false);

// Utiliser TanStack Query pour récupérer les données
const {
  data: records,
  isLoading: loading,
  isError,
  error,
  refetch
} = useQuery({
  queryKey: ['records', filters],
  queryFn: async () => {
    try {
      // S'assurer que l'utilisateur est authentifié
      if (!authService.isAuthenticated()) {
        const response = await authService.login({
          email: 'sautiereq@gmail.com',
          password: 'abcd1234'
        });
        
        isAuthenticated.value = response && !!response.token;
      }
      
      // Utiliser le service records pour récupérer les données depuis l'API
      console.log("Récupération des données depuis l'API");
      const data = await recordsService.getRecords(filters);
      
      console.log("Données reçues de l'API:", data);
      
      // Vérifier la structure des données et extraire les items si nécessaire
      let recordItems: RecordEntity[] = [];
      
      if (data && typeof data === 'object' && 'items' in data && Array.isArray(data.items)) {
        // Format ApiCollection
        recordItems = data.items as RecordEntity[];
        totalRecords.value = data.totalItems || recordItems.length;
        console.log(`Reçu ${recordItems.length} records sur ${totalRecords.value} au total`);
      } else if (Array.isArray(data)) {
        // Format tableau simple
        recordItems = data as RecordEntity[];
        totalRecords.value = data.length;
        console.log(`Reçu ${recordItems.length} records au format tableau`);
      } else {
        console.warn("Format de données inattendu:", data);
        recordItems = [];
        totalRecords.value = 0;
      }
      
      return recordItems;
    } catch (error) {
      console.error('Erreur lors de la récupération des records:', error);
      throw error;
    }
  },
  staleTime: 60 * 1000, // 1 minute avant de considérer les données comme périmées
  refetchOnWindowFocus: false // Ne pas refetch à chaque changement de focus de la fenêtre
});

// Synchroniser les filtres avec l'URL
function updateQueryParams() {
  // Ne conserver que les filtres non vides
  const queryParams: Record<string, string | number> = {};
  
  if (filters.disciplineType && filters.disciplineType.trim() !== '') queryParams.disciplineType = filters.disciplineType;
  if (filters.gender && filters.gender.trim() !== '') queryParams.gender = filters.gender;
  if (filters.category && filters.category.trim() !== '') queryParams.category = filters.category;
  if (filters.athleteName && filters.athleteName.trim() !== '') queryParams.athleteName = filters.athleteName;
  if (filters.yearFrom) queryParams.yearFrom = filters.yearFrom;
  if (filters.yearTo) queryParams.yearTo = filters.yearTo;
  if (currentPage.value > 1) queryParams.page = currentPage.value;
  
  // Remplacer les query params sans recharger la page
  router.replace({ query: queryParams });
}

// Calculer les records triés
const sortedRecords = computed(() => {
  if (!records.value || !Array.isArray(records.value)) return [];

  return [...records.value].sort((a, b) => {
    // Fonction pour obtenir la valeur à comparer selon le champ
    const getValue = (obj: any, path: string) => {
      return path.split('.').reduce((o, p) => (o && o[p] !== undefined ? o[p] : null), obj);
    };

    const aVal = getValue(a, sortField.value);
    const bVal = getValue(b, sortField.value);
    
    if (aVal === null || bVal === null) return 0;
    
    // Comparer en fonction du type de valeur
    let comparison = 0;
    
    if (typeof aVal === 'string') {
      comparison = aVal.localeCompare(bVal);
    } else if (aVal < bVal) {
      // Comparaison numérique
      comparison = -1;
    } else if (aVal > bVal) {
      comparison = 1;
    }
    
    // Appliquer l'ordre de tri
    return sortOrder.value === 'asc' ? comparison : -comparison;
  });
});

// Fonction pour changer de page
function changePage(page: number) {
  if (page < 1 || page > totalPages.value) return;
  
  currentPage.value = page;
  filters.page = page;
  updateQueryParams();
  refetch();
}

// Fonction pour trier
function sortBy(field: string) {
  // Si on clique sur le même champ, on inverse l'ordre
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    // Sinon, on utilise le nouveau champ avec l'ordre par défaut
    sortField.value = field;
    sortOrder.value = 'asc';
  }
  
  // Mettre à jour l'ordre de tri dans les filtres
  filters.order = { [sortField.value]: sortOrder.value };
  refetch();
}  // Fonction pour appliquer les filtres
function applyFilters() {
  // Réinitialiser la pagination
  currentPage.value = 1;
  filters.page = 1;
  
  // Log pour déboguer les filtres appliqués (utilisés uniquement pour le filtrage côté client)
  console.log('Filtres à appliquer côté client:', JSON.stringify(filters, null, 2));
  
  // Mise à jour des paramètres d'URL (pour le partage/sauvegarde)
  updateQueryParams();
  
  // Récupérer tous les records sans paramètres et filtrer côté client
  refetch();
}

// Fonction pour réinitialiser les filtres
function resetFilters() {
  // Réinitialiser tous les filtres
  filters.disciplineType = undefined;
  filters.gender = undefined; 
  filters.category = undefined;
  filters.athleteName = '';
  filters.yearFrom = undefined;
  filters.yearTo = undefined;
  filters.page = 1;
  currentPage.value = 1;
  updateQueryParams();
  refetch();
}

// Debounce pour les filtres textuels
const debouncedFilterChange = debounce(() => {
  applyFilters();
}, 500);

// Afficher les détails d'un record
function showRecordDetails(record: RecordEntity) {
  selectedRecord.value = record;
}

// Fermer la modal
function closeModal() {
  selectedRecord.value = null;
}

// Formatage des types de discipline
function formatDisciplineType(type: DisciplineType): string {
  switch (type) {
    case DisciplineType.RUN:
      return 'Course';
    case DisciplineType.JUMP:
      return 'Saut';
    case DisciplineType.THROW:
      return 'Lancer';
    default:
      return String(type);
  }
}

// Formatage des performances selon le type de discipline
function formatPerformance(performance: number, disciplineType: DisciplineType | string): string {
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
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', { 
    day: '2-digit', 
    month: '2-digit',
    year: 'numeric' 
  }).format(date);
}

// Au montage du composant
onMounted(async () => {
  try {
    // Tenter l'authentification
    console.log("Connexion à l'API...");
    const authResponse = await authService.login({
      email: 'sautiereq@gmail.com',
      password: 'abcd1234'
    });
    isAuthenticated.value = authResponse && !!authResponse.token;

    if (isAuthenticated.value) {
      console.log("Authentification réussie");
    } else {
      console.warn("L'authentification a échoué, certaines fonctionnalités peuvent ne pas être disponibles");
    }

    // Mettre à jour les filtres depuis les paramètres d'URL
    if (route.query.disciplineType) filters.disciplineType = route.query.disciplineType as DisciplineType;
    if (route.query.gender) filters.gender = route.query.gender as GenderType;
    if (route.query.category) filters.category = route.query.category as CategorieType;
    if (route.query.athleteName) filters.athleteName = String(route.query.athleteName);
    if (route.query.yearFrom) filters.yearFrom = Number(route.query.yearFrom);
    if (route.query.yearTo) filters.yearTo = Number(route.query.yearTo);

    // Mettre à jour la pagination si nécessaire
    if (route.query.page) {
      currentPage.value = Number(route.query.page);
      filters.page = currentPage.value;
    }
    
    // Lancer la requête initiale
    console.log("Chargement des données initiales...");
    refetch();
  } catch (error) {
    console.error("Erreur lors de l'initialisation:", error);
  }
});
</script>

<style scoped>
.records-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

h1 {
  color: #1e40af;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.875rem;
}

.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background-color: #f0f9ff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-group {
  flex: 1;
  min-width: 180px;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #334155;
  font-size: 0.875rem;
}

.filter-group select, .filter-group input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background-color: white;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.filter-group select:hover, .filter-group input:hover {
  border-color: #94a3b8;
}

.filter-group select:focus, .filter-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.filter-actions {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
  margin-left: auto;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 0.625rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  display: inline-block;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #334155;
  border: none;
  padding: 0.625rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: #cbd5e1;
}

.loading, .error, .no-records {
  text-align: center;
  padding: 2rem;
  background-color: #f8fafc;
  border-radius: 8px;
  margin-top: 1rem;
  color: #64748b;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 1rem;
  border: 3px solid rgba(59, 130, 246, 0.2);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spinner 0.8s linear infinite;
}

@keyframes spinner {
  to { transform: rotate(360deg); }
}

.error {
  color: #b91c1c;
  background-color: #fee2e2;
}

.retry-button {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  margin-top: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #1d4ed8;
}

.table-responsive {
  overflow-x: auto;
  margin-top: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.records-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.875rem;
}

.records-table th, .records-table td {
  padding: 0.875rem 1rem;
  text-align: left;
}

.records-table th {
  background-color: #1e40af;
  color: white;
  font-weight: 500;
  position: sticky;
  top: 0;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.records-table th:hover {
  background-color: #1e3a8a;
}

.records-table th:first-child {
  border-top-left-radius: 8px;
}

.records-table th:last-child {
  border-top-right-radius: 8px;
}

.records-table tr:last-child td:first-child {
  border-bottom-left-radius: 8px;
}

.records-table tr:last-child td:last-child {
  border-bottom-right-radius: 8px;
}

.records-table td {
  border-bottom: 1px solid #e2e8f0;
}

.sort-icon {
  margin-left: 0.5rem;
  display: inline-block;
  font-size: 0.75rem;
}

.records-table tr:nth-child(even) {
  background-color: #f8fafc;
}

.records-table tr:hover {
  background-color: #e0f2fe;
}

.btn-action {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-right: 0.5rem;
}

.btn-action:hover {
  background-color: #2563eb;
}

.btn-link {
  background-color: #64748b;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  display: inline-block;
}

.btn-link:hover {
  background-color: #475569;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  background-color: #f8fafc;
}

.pagination-button {
  background-color: #e2e8f0;
  color: #334155;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.pagination-button:hover:not(:disabled) {
  background-color: #cbd5e1;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  margin: 0 1rem;
  font-size: 0.875rem;
  color: #64748b;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 600px;
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  transition: color 0.2s;
}

.close-button:hover {
  color: #0f172a;
}

.record-details {
  margin-top: 1.5rem;
}

.record-detail-item {
  display: flex;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.record-detail-item .label {
  width: 35%;
  font-weight: 500;
  color: #334155;
}

.record-detail-item .value {
  width: 65%;
  color: #0f172a;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

/* Responsive styles */
@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
  }
  
  .filter-actions {
    width: 100%;
    margin-top: 1rem;
    margin-left: 0;
  }
  
  .records-table thead {
    display: none;
  }
  
  .records-table, .records-table tbody, .records-table tr, .records-table td {
    display: block;
    width: 100%;
  }
  
  .records-table tr {
    margin-bottom: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  
  .records-table td {
    display: flex;
    padding: 0.5rem 1rem;
    border-bottom: none;
    position: relative;
    min-height: 2.5rem;
    align-items: center;
  }
  
  .records-table td::before {
    content: attr(data-label);
    width: 40%;
    font-weight: 500;
    color: #334155;
    margin-right: 1rem;
    flex-shrink: 0;
  }
  
  .pagination-info {
    text-align: center;
  }
  
  .modal-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
