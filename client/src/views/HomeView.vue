<script setup lang="ts">
import { ref } from 'vue';
import ApiStatus from '@/components/ApiStatus.vue';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  TrophyIcon, 
  ClockIcon,
  ArrowRightIcon,
  SparklesIcon  
} from '@heroicons/vue/24/outline';

const stats = ref([
  { title: 'Records', value: '2,500+', icon: ChartBarIcon, color: 'bg-blue-100 dark:bg-blue-800/30 text-blue-700 dark:text-blue-300' },
  { title: 'Athlètes', value: '1,200+', icon: UserGroupIcon, color: 'bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-300' },
  { title: 'Compétitions', value: '350+', icon: TrophyIcon, color: 'bg-amber-100 dark:bg-amber-800/30 text-amber-700 dark:text-amber-300' },
  { title: 'Années d\'archives', value: '15+', icon: ClockIcon, color: 'bg-purple-100 dark:bg-purple-800/30 text-purple-700 dark:text-purple-300' },
]);

const features = ref([
  {
    title: 'Visualisation des Records',
    description: 'Consultez les records par catégorie, épreuve, et année. Filtrez et triez pour trouver exactement ce que vous cherchez.',
    icon: ChartBarIcon,
  },
  {
    title: 'Profils d\'Athlètes',
    description: 'Découvrez les profils complets des athlètes avec leur historique de performances et records personnels.',
    icon: UserGroupIcon,
  },
  {
    title: 'Statistiques Avancées',
    description: 'Analysez les tendances, progressions, et comparaisons entre différentes catégories et périodes.',
    icon: SparklesIcon,
  }
]);
</script>

<template>
  <div class="space-y-12 py-8">
    <!-- Hero Section -->
    <section class="relative">
      <div class="mx-auto max-w-5xl text-center">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-400 dark:to-primary-600">Records Viewer</span>
        </h1>
        <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          La plateforme de référence pour consulter et analyser les performances sportives
          de tous les athlètes.
        </p>
        <div class="mt-8 flex items-center justify-center gap-x-6">
          <Button @click="$router.push('/records')">
            Voir les records
            <ArrowRightIcon class="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" @click="$router.push('/about')">
            En savoir plus
          </Button>
        </div>
      </div>
    </section>
    
    <!-- API Status Card -->
    <section class="mx-auto max-w-5xl">
      <Card className="overflow-hidden">
        <template #header>
          <div class="flex justify-between items-center w-full">
            <h2 class="text-lg font-semibold">Statut du système</h2>
            <div class="text-sm text-gray-500 dark:text-gray-400">Mise à jour en temps réel</div>
          </div>
        </template>
        
        <div class="p-4">
          <ApiStatus />
        </div>
      </Card>
    </section>
    
    <!-- Stats Section -->
    <section class="mx-auto max-w-5xl">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Nos chiffres</h2>
      
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="(stat, index) in stats" :key="index" class="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
          <div :class="['absolute top-0 right-0 -mt-6 -mr-6 h-24 w-24 rounded-full opacity-20', stat.color]"></div>
          
          <div :class="['inline-flex rounded-lg p-3', stat.color]">
            <component :is="stat.icon" class="h-6 w-6" />
          </div>
          
          <h3 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{{ stat.value }}</h3>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ stat.title }}</p>
        </div>
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="mx-auto max-w-5xl">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Fonctionnalités</h2>
      
      <div class="grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div v-for="(feature, index) in features" :key="index" class="relative rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div class="mb-4 inline-flex items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-800/30 p-2 text-primary-600 dark:text-primary-300">
            <component :is="feature.icon" class="h-6 w-6" />
          </div>
          
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ feature.title }}</h3>
          <p class="text-gray-600 dark:text-gray-400">{{ feature.description }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
body {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
}

h1 {
  margin-bottom: 2rem;
  color: #333;
  font-weight: 300;
  font-size: 2.2rem;
  text-align: center;
}

section {
  margin-bottom: 2.5rem;
}

h2 {
  margin-bottom: 1rem;
  color: #333;
  font-weight: 500;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

h3 {
  margin: 1.5rem 0 0.75rem;
  font-weight: 500;
  color: #424242;
}

p {
  line-height: 1.6;
  color: #555;
}

.status-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.info-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>
