<script setup lang="ts">
import { ref } from 'vue';
import ApiStatus from '@/components/ApiStatus.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const stats = ref([
  { title: 'Records', value: '2,500+', icon: 'heroicons:chart-bar', color: 'bg-blue-100 dark:bg-blue-800/30 text-blue-700 dark:text-blue-300' },
  { title: 'Athlètes', value: '1,200+', icon: 'heroicons:user-group', color: 'bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-300' },
  { title: 'Compétitions', value: '350+', icon: 'heroicons:trophy', color: 'bg-amber-100 dark:bg-amber-800/30 text-amber-700 dark:text-amber-300' },
  { title: 'Années d\'archives', value: '15+', icon: 'heroicons:clock', color: 'bg-purple-100 dark:bg-purple-800/30 text-purple-700 dark:text-purple-300' },
]);

const features = ref([
  {
    title: 'Visualisation des Records',
    description: 'Consultez les records par catégorie, épreuve, et année. Filtrez et triez pour trouver exactement ce que vous cherchez.',
    icon: 'heroicons:chart-bar',
  },
  {
    title: 'Profils d\'Athlètes',
    description: 'Découvrez les profils complets des athlètes avec leur historique de performances et records personnels.',
    icon: 'heroicons:user-group',
  },
  {
    title: 'Statistiques Avancées',
    description: 'Analysez les tendances, progressions, et comparaisons entre différentes catégories et périodes.',
    icon: 'heroicons:sparkles',
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
          <UButton label="Voir les records" trailing-icon="heroicons:arrow-right" @click="router.push('/records')" />
          <UButton label="En savoir plus" variant="outline" @click="router.push('/about')" />
        </div>
      </div>
    </section>
    
    <!-- API Status Card -->
    <section class="mx-auto max-w-5xl">
      <UCard :ui="{ body: 'p-0 sm:p-0', header: 'p-4 sm:px-6' }" class="overflow-hidden">
        <template #header>
          <div class="flex justify-between items-center w-full">
            <h2 class="text-lg font-semibold">Statut du système</h2>
            <div class="text-sm text-gray-500 dark:text-gray-400">Mise à jour en temps réel</div>
          </div>
        </template>
        
        <div class="p-4">
          <ApiStatus />
        </div>
      </UCard>
    </section>
    
    <!-- Stats Section -->
    <section class="mx-auto max-w-5xl">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Nos chiffres</h2>
      
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="(stat, index) in stats" :key="index" class="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
          <div :class="['absolute top-0 right-0 -mt-6 -mr-6 h-24 w-24 rounded-full opacity-20', stat.color]"/>
          
          <div :class="['inline-flex rounded-lg p-3', stat.color]">
            <Icon :name="stat.icon" class="h-6 w-6" />
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
            <Icon :name="feature.icon" class="h-6 w-6" />
          </div>
          
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ feature.title }}</h3>
          <p class="text-gray-600 dark:text-gray-400">{{ feature.description }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
