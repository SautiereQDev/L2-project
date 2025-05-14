<script setup lang="ts">
import ApiStatus from '@/components/ApiStatus.vue';
</script>

<template>
  <div class="home-container">
    <h1 class="text-3xl font-bold text-center mb-8">Bienvenue sur Records Viewer</h1>
    
    <div class="max-w-4xl mx-auto p-4">
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-2xl font-bold mb-4">État du système</h2>
        <ApiStatus />
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold mb-4">À propos de l'application</h2>
        <p class="mb-4">
          Cette application vous permet de gérer et visualiser vos collections d'enregistrements.
          Elle est construite avec Vue.js et utilise une API Symfony pour les fonctionnalités backend.
        </p>
        <div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
          <p class="font-medium">
            Pour commencer, assurez-vous que la connexion à l'API est établie (vérifiez l'état ci-dessus).
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 2rem 1rem;
}

@media (min-width: 768px) {
  .home-container {
    padding: 3rem 2rem;
  }
}
</style>
