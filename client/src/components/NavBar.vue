<template>
  <nav class="navbar">
    <div class="logo">
      <router-link to="/">AthlètePerformance</router-link>
    </div>
    <div class="menu-container">
      <!-- Menu principal -->
      <ul class="main-menu">
        <li><router-link to="/">Accueil</router-link></li>
        
        <!-- Menu déroulant des records -->
        <li class="dropdown">
          <a href="#" @click.prevent="toggleDropdown('records')">Records</a>
          <ul v-show="activeDropdown === 'records'" class="dropdown-menu">
            <li><router-link to="/records/disciplines">Par discipline</router-link></li>
            <li><router-link to="/records/categories">Par catégorie d'âge</router-link></li>
            <li><router-link to="/records/genres">Par sexe</router-link></li>
            <li><router-link to="/records/search">Recherche avancée</router-link></li>
          </ul>
        </li>
        
        <!-- Menu déroulant des disciplines -->
        <li class="dropdown">
          <a href="#" @click.prevent="toggleDropdown('disciplines')">Disciplines</a>
          <ul v-show="activeDropdown === 'disciplines'" class="dropdown-menu">
            <li><router-link to="/disciplines/run">Courses</router-link></li>
            <li><router-link to="/disciplines/jump">Sauts</router-link></li>
            <li><router-link to="/disciplines/throw">Lancers</router-link></li>
          </ul>
        </li>
        
        <li><router-link to="/athletes">Athlètes</router-link></li>
        <li><router-link to="/about">À propos</router-link></li>
        <li><router-link to="/contact">Contact</router-link></li>
      </ul>
      
      <!-- Menu utilisateur -->
      <ul class="user-menu">
        <li><router-link to="/login">Connexion</router-link></li>
        <li><router-link to="/register">Inscription</router-link></li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const activeDropdown = ref<string | null>(null);

// Gestion des menus déroulants
function toggleDropdown(menu: string) {
  activeDropdown.value = activeDropdown.value === menu ? null : menu;
}

// Fermer le menu déroulant au clic en dehors
function handleClickOutside(event: MouseEvent) {
  if (activeDropdown.value && !(event.target as Element).closest('.dropdown')) {
    activeDropdown.value = null;
  }
}

// Event listeners pour fermer le menu quand on clique ailleurs
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e40af; /* Bleu foncé */
  padding: 0 2rem;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo a {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  padding: 1rem 0;
  display: block;
}

.menu-container {
  display: flex;
  align-items: center;
}

.main-menu, .user-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.user-menu {
  margin-left: 2rem;
}

.main-menu li, .user-menu li {
  position: relative;
}

.main-menu a, .user-menu a {
  display: block;
  color: white;
  text-decoration: none;
  padding: 1rem 1.5rem;
  transition: background-color 0.3s;
}

.main-menu a:hover, .user-menu a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #2563eb; /* Bleu légèrement plus clair */
  min-width: 200px;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  list-style: none;
  margin: 0;
  padding: 0;
  z-index: 10;
}

.dropdown-menu a {
  padding: 0.75rem 1.5rem;
  color: white;
}

.dropdown-menu a:hover {
  background-color: #1d4ed8;
}

.user-menu li {
  margin-left: 0.5rem;
}

.user-menu a {
  border-radius: 4px;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.user-menu a:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Styles responsives */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    padding: 0;
  }
  
  .menu-container {
    flex-direction: column;
    width: 100%;
  }
  
  .main-menu, .user-menu {
    flex-direction: column;
    width: 100%;
  }
  
  .user-menu {
    margin-left: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .dropdown-menu {
    position: static;
    background-color: #3b82f6;
    box-shadow: none;
    width: 100%;
  }
  
  .main-menu a, .user-menu a {
    padding: 1rem;
  }
  
  .dropdown-menu a {
    padding-left: 2rem;
  }
}
</style>