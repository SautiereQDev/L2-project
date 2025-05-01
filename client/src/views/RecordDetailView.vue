<template>
  <div class="record-detail-view">
    <div v-if="isLoading" class="loading">
      Chargement des dimport { DisciplineType } from '@/types';tails du record...
    </div>
    
    <div v-else-if="isError" class="error">
      Une erreur s'est produite lors du chargement des détails du record.
      <button @click="refetch" class="btn-primary">Réessayer</button>
    </div>
    
    <div v-else-if="record" class="record-content">
      <div class="back-link">
        <router-link to="/records/paginated" class="btn-back">
          &laquo; Retour aux records
        </router-link>
      </div>
      
      <div class="record-header">
        <h1>{{ record.discipline.name }} - {{ record.genre === 'MEN' ? 'Homme' : 'Femme' }}</h1>
        <div class="record-meta">
          <span class="category">Catégorie: {{ record.categorie }}</span>
          <span class="record-date">
            Date du record: {{ formatDate(record.lastRecord) }}
          </span>
        </div>
      </div>
      
      <div class="record-body">
        <div class="record-main">
          <div class="record-info">
            <h2>Performance</h2>
            <div class="performance">
              {{ formatPerformance(record.performance, record.discipline.type) }}
            </div>
            
            <h2>Athlète</h2>
            <div class="athlete-info">
              <div class="athlete-name">{{ record.athlete.firstname }} {{ record.athlete.lastname }}</div>
              <div class="athlete-details">
                <div>Date de naissance: {{ formatDate(record.athlete.birthdate) }}</div>
                <div>Pays: {{ record.athlete.country }}</div>
                <div v-if="record.athlete.heigth">Taille: {{ record.athlete.heigth }} cm</div>
                <div v-if="record.athlete.weigth">Poids: {{ record.athlete.weigth }} kg</div>
                <div v-if="record.athlete.coach">Entraîneur: {{ record.athlete.coach }}</div>
              </div>
            </div>
            
            <h2>Lieu</h2>
            <div class="location-info">
              <div>{{ record.location.name }}</div>
              <div>{{ record.location.city }}, {{ record.location.country }}</div>
            </div>
          </div>
        </div>
        
        <div class="record-sidebar">
          <h2>Records connexes</h2>
          
          <div v-if="!similarRecords || similarRecords.length === 0" class="no-similar-records">
            Aucun record similaire trouvé.
          </div>
          
          <div v-else class="related-records">
            <div 
              v-for="similarRecord in similarRecords" 
              :key="similarRecord.id" 
              class="related-record-card"
            >
              <div class="related-record-discipline">{{ similarRecord.discipline.name }}</div>
              <div class="related-record-athlete">
                {{ similarRecord.athlete.firstname }} {{ similarRecord.athlete.lastname }}
              </div>
              <div class="related-record-performance">
                {{ formatPerformance(similarRecord.performance, similarRecord.discipline.type) }}
              </div>
              <div class="related-record-date">{{ formatDate(similarRecord.lastRecord) }}</div>
              <router-link :to="`/records/${similarRecord.id}`" class="btn-details">
                Voir
              </router-link>
            </div>
          </div>
          
          <div v-if="record.previousRecord" class="previous-record">
            <h2>Record précédent</h2>
            <div class="previous-record-details">
              <div>Performance: {{ formatPerformance(record.previousRecord.performance, record.discipline.type) }}</div>
              <div>Date: {{ formatDate(record.previousRecord.lastRecord) }}</div>
              <div>
                Athlète: {{ record.previousRecord.athlete.firstname }} {{ record.previousRecord.athlete.lastname }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="not-found">
      <h1>Record non trouvé</h1>
      <p>Le record que vous recherchez n'existe pas ou a été supprimé.</p>
      <router-link to="/records/paginated" class="btn-back">
        Retour aux records
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRecordDetail } from '../composables/useRecordDetail';
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { DisciplineType } from '@/types/record.types';

// Récupérer l'ID du record depuis l'URL
const route = useRoute();
const recordId = computed(() => Number(route.params.id));

// Utilisation du composable pour récupérer les détails du record
const { 
  record, 
  similarRecords, 
  isLoading, 
  isError, 
  refetch 
} = useRecordDetail(recordId.value);

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
.record-detail-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading, .error, .not-found {
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

.back-link {
  margin-bottom: 20px;
}

.btn-back {
  display: inline-block;
  padding: 8px 16px;
  background-color: #e2e8f0;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
}

.btn-primary {
  background-color: #4a6cf7;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.record-header {
  margin-bottom: 30px;
}

.record-header h1 {
  margin-bottom: 5px;
  font-size: 2rem;
  color: #2d3748;
}

.record-meta {
  display: flex;
  gap: 15px;
  font-size: 0.9rem;
  color: #718096;
}

.record-body {
  display: flex;
  gap: 30px;
}

.record-main {
  flex: 2;
}

.record-sidebar {
  flex: 1;
  background-color: #f8fafc;
  padding: 20px;
  border-radius: 8px;
}

.record-info h2 {
  color: #4a5568;
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.performance {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  padding: 10px 0;
}

.athlete-info, .location-info {
  padding: 10px 0;
}

.athlete-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.athlete-details, .location-info {
  line-height: 1.6;
  color: #4a5568;
}

.related-records {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;
}

.related-record-card {
  padding: 15px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.related-record-discipline {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 5px;
}

.related-record-athlete {
  font-size: 0.9rem;
  color: #4a5568;
  margin-bottom: 5px;
}

.related-record-performance {
  font-weight: 600;
  font-size: 1.1rem;
  color: #2d3748;
  margin-bottom: 5px;
}

.related-record-date {
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 10px;
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

.previous-record {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.previous-record-details {
  background-color: white;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  line-height: 1.6;
  color: #4a5568;
}

.no-similar-records {
  color: #718096;
  font-style: italic;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .record-body {
    flex-direction: column;
  }
  
  .record-sidebar {
    margin-top: 20px;
  }
}
</style>
