<template>
  <div class="app-layout">
    <header>
      <nav-bar />
    </header>
    
    <main class="main-content">
      <router-view />
    </main>
    
    <footer class="app-footer">
      <div class="footer-content">
        <p>&copy; {{ currentYear }} AthlètePerformance (Quentin Sautière) - Tous droits réservés</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
const currentYear = new Date().getFullYear();
</script>

<style>
:root {
  --primary-color: #1e40af;
  --secondary-color: #3b82f6;
  --text-color: #1f2937;
  --light-bg: #f8fafc;
  --border-color: #e5e7eb;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  color: var(--text-color);
  line-height: 1.6;
  background-color: #f1f5f9;
}

.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}

.app-footer {
  background-color: var(--primary-color);
  color: white;
  padding: 1.5rem 0;
  margin-top: 2rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem 0;
  }
  
  .app-footer {
    padding: 1rem 0;
  }
}
</style>