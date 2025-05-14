<template>
  <div class="performance-chart">
    <div v-if="loading || !chartData" class="py-16 flex items-center justify-center">
      <UIcon name="i-heroicons-chart-bar" class="h-10 w-10 text-gray-300 animate-pulse" />
    </div>
    <div v-else-if="error" class="py-10 text-center">
      <UIcon name="i-heroicons-exclamation-circle" class="h-8 w-8 text-warning-500 mx-auto mb-2" />
      <div class="text-gray-500">Impossible de charger les données d'évolution</div>
      <UButton 
        size="sm" 
        color="gray" 
        variant="ghost" 
        class="mt-2"
        icon="i-heroicons-arrow-path"
        @click="retry"
      >
        Réessayer
      </UButton>
    </div>
    <div v-else-if="noData" class="py-10 text-center">
      <UIcon name="i-heroicons-chart-bar-square" class="h-8 w-8 text-gray-400 mx-auto mb-2" />
      <div class="text-gray-500">Pas assez de données pour afficher l'évolution</div>
    </div>
    <div v-else ref="chartContainer" class="w-full h-64"></div>

    <div v-if="chartData && !noData && !loading && !error" class="flex justify-center items-center gap-3 mt-4">
      <UButton 
        v-for="period in periodOptions" 
        :key="period.value" 
        size="xs" 
        :variant="selectedPeriod === period.value ? 'solid' : 'ghost'" 
        :color="selectedPeriod === period.value ? 'primary' : 'gray'"
        @click="setTimePeriod(period.value)"
      >
        {{ period.label }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { DisciplineType } from '~/types/record.types';

interface Props {
  /**
   * Identifiant du record
   */
  recordId: number;
  
  /**
   * Type de discipline
   */
  disciplineType: DisciplineType;
  
  /**
   * Valeur actuelle de la performance
   */
  currentValue: number;
}

const props = defineProps<Props>();

// Références et états
const chartContainer = ref<HTMLElement | null>(null);
const loading = ref(true);
const error = ref(false);
const chartData = ref<any | null>(null);
const chart = ref<any>(null);
const selectedPeriod = ref<string>('1y');

// Options de période
const periodOptions = [
  { label: '1 mois', value: '1m' },
  { label: '6 mois', value: '6m' },
  { label: '1 an', value: '1y' },
  { label: '5 ans', value: '5y' },
  { label: 'Max', value: 'all' }
];

// Données insuffisantes
const noData = computed(() => {
  return chartData.value?.dataPoints?.length < 2;
});

// Initialisation du composant
onMounted(async () => {
  await fetchChartData();
});

// Réagir aux changements de recordId
watch(() => props.recordId, async () => {
  loading.value = true;
  await fetchChartData();
});

// Réagir aux changements de période
watch(selectedPeriod, () => {
  if (chartData.value) {
    renderChart();
  }
});

/**
 * Récupérer les données pour le graphique
 */
async function fetchChartData() {
  try {
    loading.value = true;
    error.value = false;
    
    // Utilisation de données simulées - à remplacer par un vrai appel API
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulation de latence réseau
    
    // Générer des données simulées d'évolution en fonction de la discipline
    chartData.value = generateMockChartData(props.disciplineType, props.currentValue);
    
    // Rendre le graphique
    await renderChart();
  } catch (e) {
    console.error('Erreur lors du chargement des données', e);
    error.value = true;
  } finally {
    loading.value = false;
  }
}

/**
 * Réessayer en cas d'erreur
 */
async function retry() {
  await fetchChartData();
}

/**
 * Changer la période affichée
 */
function setTimePeriod(period: string) {
  selectedPeriod.value = period;
}

/**
 * Rendre le graphique avec les bibliothèques disponibles
 */
async function renderChart() {
  if (!chartContainer.value || !chartData.value) return;
  
  // On simule l'affichage d'un graphique avec une représentation HTML/CSS simple
  // Dans une vraie application, utilisez une bibliothèque comme Chart.js, ApexCharts, etc.
  
  // Récupérer les données filtrées en fonction de la période sélectionnée
  const filteredData = filterDataByPeriod(chartData.value.dataPoints, selectedPeriod.value);
  
  // Générer le graphique HTML/CSS simple
  generateSimpleChart(filteredData);
}

/**
 * Générer un graphique HTML/CSS simple
 */
function generateSimpleChart(dataPoints: any[]) {
  if (!chartContainer.value) return;
  
  // Vider le conteneur
  chartContainer.value.innerHTML = '';
  
  // Créer le conteneur de graphique
  const chartWrapper = document.createElement('div');
  chartWrapper.className = 'relative w-full h-full flex items-end';
  
  // Ajouter une ligne de base
  const baseline = document.createElement('div');
  baseline.className = 'absolute bottom-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700';
  chartWrapper.appendChild(baseline);
  
  // Valeurs min/max pour le scaling
  const isDisciplineRunning = props.disciplineType === DisciplineType.RUN;
  
  // Pour les courses, on inverse la valeur (meilleure perf = temps plus bas)
  const values = isDisciplineRunning 
    ? dataPoints.map(d => -d.value) // Négativation pour l'inversion
    : dataPoints.map(d => d.value);
  
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const valueRange = maxValue - minValue || 1;
  
  // Largeur des barres
  const barWidth = 100 / (dataPoints.length * 1.5);
  
  // Créer les barres du graphique
  dataPoints.forEach((point, index) => {
    // Conteneur de la barre avec date
    const barContainer = document.createElement('div');
    barContainer.className = 'flex flex-col items-center';
    barContainer.style.width = `${barWidth}%`;
    barContainer.style.marginRight = `${barWidth * 0.5}%`;
    
    // Pour les courses, la meilleure performance est le temps le plus bas
    // Pour les sauts/lancers, la meilleure performance est la distance la plus grande
    let heightPercentage;
    if (isDisciplineRunning) {
      // Pour les courses (inversé)
      heightPercentage = (((-point.value) - minValue) / valueRange) * 85 + 5;
    } else {
      // Pour les sauts/lancers
      heightPercentage = ((point.value - minValue) / valueRange) * 85 + 5;
    }
    
    // Barre
    const bar = document.createElement('div');
    bar.className = `rounded-t-md transition-all duration-500 ease-out ${getBarColorClass()}`;
    bar.style.height = `${heightPercentage}%`;
    bar.style.width = '100%';
    
    // Tooltip avec la valeur
    const valueFormatted = formatPerformanceValue(point.value, props.disciplineType);
    bar.setAttribute('title', `${point.date}: ${valueFormatted}`);
    bar.classList.add('group', 'relative');
    
    // Tooltip personnalisé
    const tooltip = document.createElement('div');
    tooltip.className = 'absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none transition-opacity z-10 whitespace-nowrap';
    tooltip.textContent = valueFormatted;
    bar.appendChild(tooltip);
    
    // Animation d'entrée
    setTimeout(() => {
      bar.style.height = `${heightPercentage}%`;
    }, index * 100);
    
    // Date
    const dateEl = document.createElement('div');
    dateEl.className = 'text-xs text-gray-500 mt-1 truncate text-center';
    dateEl.textContent = formatChartDate(point.date);
    
    barContainer.appendChild(bar);
    barContainer.appendChild(dateEl);
    chartWrapper.appendChild(barContainer);
  });
  
  // Ajouter le graphique au conteneur
  chartContainer.value.appendChild(chartWrapper);
}

/**
 * Classe de couleur pour les barres selon le type de discipline
 */
function getBarColorClass() {
  switch (props.disciplineType) {
    case DisciplineType.RUN:
      return 'bg-gradient-to-t from-running-500 to-running-400';
    case DisciplineType.JUMP:
      return 'bg-gradient-to-t from-jumping-500 to-jumping-400';
    case DisciplineType.THROW:
      return 'bg-gradient-to-t from-throwing-500 to-throwing-400';
    default:
      return 'bg-gradient-to-t from-primary-500 to-primary-400';
  }
}

/**
 * Filtrer les données en fonction de la période sélectionnée
 */
function filterDataByPeriod(data: any[], period: string) {
  if (period === 'all') return data;
  
  const now = new Date();
  const cutoffDate = new Date();
  
  switch (period) {
    case '1m':
      cutoffDate.setMonth(now.getMonth() - 1);
      break;
    case '6m':
      cutoffDate.setMonth(now.getMonth() - 6);
      break;
    case '1y':
      cutoffDate.setFullYear(now.getFullYear() - 1);
      break;
    case '5y':
      cutoffDate.setFullYear(now.getFullYear() - 5);
      break;
  }
  
  return data.filter(point => new Date(point.date) >= cutoffDate);
}

/**
 * Formater une date pour l'affichage dans le graphique
 */
function formatChartDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getFullYear().toString().substr(2, 2)}`;
}

/**
 * Formater la valeur de performance en fonction du type de discipline
 */
function formatPerformanceValue(value: number, disciplineType: DisciplineType): string {
  if (disciplineType === DisciplineType.RUN) {
    // Format time MM:SS.MS for running events
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    const milliseconds = Math.round((value % 1) * 100);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  } else {
    // Format distance in meters for jumps and throws
    return `${value.toFixed(2)}m`;
  }
}

/**
 * Générer des données simulées pour le graphique
 */
function generateMockChartData(disciplineType: DisciplineType, currentValue: number) {
  // Nombre de points de données
  const pointsCount = 8 + Math.floor(Math.random() * 7); // Entre 8 et 14 points
  
  // Date de début (3 ans dans le passé)
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 3);
  
  // Intervalle entre chaque point (en jours)
  const dayInterval = Math.floor(1095 / pointsCount); // 3 ans = ~1095 jours
  
  // Tableau pour stocker les points de données
  const dataPoints = [];
  
  // Pour les courses, la progression est une diminution (temps plus court = meilleure perf)
  // Pour les sauts/lancers, la progression est une augmentation (distance plus grande = meilleure perf)
  const isRunningDiscipline = disciplineType === DisciplineType.RUN;
  
  // Valeurs pour calculer la progression
  const maxVariation = isRunningDiscipline ? 0.08 : 0.12; // Variation maximale entre deux points
  
  // Valeur initiale (légèrement moins bonne que la valeur actuelle)
  let initialValue;
  if (isRunningDiscipline) {
    initialValue = currentValue * (1 + 0.15); // 15% plus lent
  } else {
    initialValue = currentValue * (1 - 0.15); // 15% plus court/bas
  }
  
  // Générer les points de données
  for (let i = 0; i < pointsCount; i++) {
    // Calculer la date de ce point
    const pointDate = new Date(startDate);
    pointDate.setDate(startDate.getDate() + (i * dayInterval));
    
    // Calculer la valeur de ce point
    let pointValue;
    if (i === pointsCount - 1) {
      // Le dernier point est la valeur actuelle
      pointValue = currentValue;
    } else {
      // Calculer la progression
      const progressRatio = i / (pointsCount - 1);
      
      if (isRunningDiscipline) {
        // Pour les courses: diminuer le temps progressivement
        const targetImprovement = initialValue - currentValue;
        pointValue = initialValue - (targetImprovement * progressRatio);
        
        // Ajouter une variation aléatoire pour plus de réalisme
        const variation = (Math.random() * 2 - 1) * maxVariation * pointValue;
        pointValue += variation;
      } else {
        // Pour les sauts/lancers: augmenter la distance progressivement
        const targetImprovement = currentValue - initialValue;
        pointValue = initialValue + (targetImprovement * progressRatio);
        
        // Ajouter une variation aléatoire pour plus de réalisme
        const variation = (Math.random() * 2 - 1) * maxVariation * pointValue;
        pointValue += variation;
      }
    }
    
    // Formater la date en chaîne ISO
    const dateString = pointDate.toISOString().split('T')[0];
    
    // Ajouter le point de données
    dataPoints.push({
      date: dateString,
      value: pointValue
    });
  }
  
  // Trier les points par date
  dataPoints.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return {
    disciplineType,
    dataPoints
  };
}
</script>

<style scoped>
.performance-chart {
  transition: all 0.3s ease;
}
</style>
