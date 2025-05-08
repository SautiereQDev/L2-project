<template>
  <div class="record-details-view">
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement des détails du record...</p>
    </div>

    <div v-else-if="isError" class="error-state">
      <p>Une erreur est survenue: {{ error }}</p>
      <button @click="$router.go(-1)" class="back-button">Retour</button>
    </div>

    <div v-else-if="record" class="record-details-container">
      <div class="header-with-back">
        <button class="back-button" @click="$router.go(-1)">← Retour</button>
        <h1>Détails du Record</h1>
      </div>

      <div class="record-info">
        <div class="record-header">
          <h2>
            {{ record.discipline.name }}
            <span class="discipline-type">({{ getDisciplineTypeLabel(record.discipline.type) }})</span>
          </h2>
          <div class="performance-badge" :class="record.discipline.type">
            {{ formatPerformance(record.performance, record.discipline.type) }}
          </div>
        </div>

        <div class="info-grid">
          <div class="info-card">
            <h3>Athlète</h3>
            <div class="athlete-info">
              <div class="athlete-name">{{ record.athlete.firstname }} {{ record.athlete.lastname }}</div>
              <div class="athlete-country">{{ record.athlete.country }}</div>
            </div>
          </div>

          <div class="info-card">
            <h3>Détails</h3>
            <div class="detail-item">
              <span class="detail-label">Date:</span>
              <span class="detail-value">{{ formatDate(record.lastRecord) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Catégorie:</span>
              <span class="detail-value">{{ getCategoryLabel(record.categorie) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Genre:</span>
              <span class="detail-value">{{ record.genre === 'MEN' ? 'Homme' : 'Femme' }}</span>
            </div>
          </div>

          <div class="info-card">
            <h3>Lieu</h3>
            <div class="detail-item">
              <span class="detail-label">Stade:</span>
              <span class="detail-value">{{ record.location.name }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Ville:</span>
              <span class="detail-value">{{ record.location.city }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Pays:</span>
              <span class="detail-value">{{ record.location.country }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="similarRecords && similarRecords.length > 0" class="similar-records">
        <h2>Records similaires</h2>

        <div class="similar-records-grid">
          <div
            v-for="similarRecord in similarRecords"
            :key="similarRecord.id"
            class="similar-record-card"
            @click="viewRecordDetails(similarRecord.id)"
          >
            <div class="similar-record-header">
              <h4>{{ similarRecord.discipline.name }}</h4>
              <div class="performance-badge small" :class="similarRecord.discipline.type">
                {{ formatPerformance(similarRecord.performance, similarRecord.discipline.type) }}
              </div>
            </div>
            <div class="similar-record-details">
              <div class="athlete-name">{{ similarRecord.athlete.firstname }} {{ similarRecord.athlete.lastname }}</div>
              <div class="record-meta">
                {{ formatDate(similarRecord.lastRecord) }} •
                {{ similarRecord.genre === 'MEN' ? 'Homme' : 'Femme' }} •
                {{ similarRecord.categorie }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="not-found">
      <p>Le record demandé n'a pas été trouvé.</p>
      <button @click="$router.go(-1)" class="back-button">Retour</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useRecordDetails } from '@/composables/useRecordDetails';

const route = useRoute();
const router = useRouter();
const recordId = Number(route.params.id);

// Utiliser notre composable pour les détails du record
const {
  record,
  similarRecords,
  isLoading,
  isError,
  error,
  loadRecord,
  isFetching
} = useRecordDetails(recordId);

// Naviguer vers les détails d'un autre record
function viewRecordDetails(id: number) {
  router.push(`/records/${id}`);
  loadRecord(id);
}

// Convertir le type de discipline en libellé
function getDisciplineTypeLabel(type: string): string {
  const types: Record<string, string> = {
    'run': 'Course',
    'jump': 'Saut',
    'throw': 'Lancer'
  };

  return types[type] || type;
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
.record-details-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.loading-state, .error-state, .not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(30, 64, 175, 0.2);
  border-radius: 50%;
  border-top-color: #1e40af;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state {
  color: #dc2626;
}

.header-with-back {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.back-button {
  background-color: #e5e7eb;
  color: #4b5563;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: #d1d5db;
}

h1 {
  color: #1e40af;
  margin: 0;
}

h2 {
  color: #1e40af;
  margin: 0 0 1rem 0;
}

h3 {
  color: #4b5563;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.discipline-type {
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: normal;
}

.performance-badge {
  background-color: #1e40af;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.2rem;
}

.performance-badge.run {
  background-color: #2563eb;
}

.performance-badge.jump {
  background-color: #7c3aed;
}

.performance-badge.throw {
  background-color: #db2777;
}

.performance-badge.small {
  font-size: 0.9rem;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
}

.record-info {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.info-card {
  background-color: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
}

.athlete-info {
  display: flex;
  flex-direction: column;
}

.athlete-name {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.athlete-country {
  color: #6b7280;
}

.detail-item {
  margin-bottom: 0.75rem;
  display: flex;
}

.detail-label {
  font-weight: 500;
  width: 100px;
  flex-shrink: 0;
  color: #4b5563;
}

.detail-value {
  color: #111827;
}

.similar-records {
  margin-top: 2.5rem;
}

.similar-records-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.similar-record-card {
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.similar-record-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.similar-record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.similar-record-header h4 {
  margin: 0;
  font-size: 1rem;
  color: #1e40af;
}

.similar-record-details {
  font-size: 0.9rem;
}

.record-meta {
  color: #6b7280;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

@media (max-width: 768px) {
  .record-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .similar-records-grid {
    grid-template-columns: 1fr;
  }
}
</style>
