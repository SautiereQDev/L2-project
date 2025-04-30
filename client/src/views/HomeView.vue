<template>
  <div class="home-view">
    <section class="hero">
      <div class="hero-content">
        <h1>AthlètePerformance</h1>
        <p>Découvrez les records d'athlétisme par discipline, catégorie d'âge et sexe</p>
        <div class="hero-buttons">
          <router-link to="/records/disciplines" class="btn primary">Explorer les records</router-link>
          <router-link to="/records/search" class="btn secondary">Recherche avancée</router-link>
        </div>
      </div>
    </section>

    <section class="featured-section">
      <h2>Records à la une</h2>
      <div class="featured-cards">
        <div class="featured-card">
          <h3>Records Hommes</h3>
          <p>Découvrez les performances exceptionnelles des athlètes masculins</p>
          <router-link to="/records/genres?gender=MEN" class="card-link">Voir les records</router-link>
        </div>
        <div class="featured-card">
          <h3>Records Femmes</h3>
          <p>Explorez les performances remarquables des athlètes féminines</p>
          <router-link to="/records/genres?gender=WOMEN" class="card-link">Voir les records</router-link>
        </div>
        <div class="featured-card">
          <h3>Records Seniors</h3>
          <p>Les meilleures performances des athlètes seniors</p>
          <router-link to="/records/categories?category=SENIOR" class="card-link">Voir les records</router-link>
        </div>
      </div>
    </section>

    <section class="discipline-section">
      <h2>Disciplines</h2>
      <div class="discipline-cards">
        <div class="discipline-card run">
          <h3>Courses</h3>
          <p>Sprint, demi-fond, fond, haies et plus</p>
          <router-link to="/disciplines/run" class="card-link">Explorer</router-link>
        </div>
        <div class="discipline-card jump">
          <h3>Sauts</h3>
          <p>Hauteur, longueur, triple saut et perche</p>
          <router-link to="/disciplines/jump" class="card-link">Explorer</router-link>
        </div>
        <div class="discipline-card throw">
          <h3>Lancers</h3>
          <p>Poids, disque, javelot et marteau</p>
          <router-link to="/disciplines/throw" class="card-link">Explorer</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Pas besoin d'importer NavBar ici car il est déjà inclus dans le layout
</script>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero {
  background: linear-gradient(120deg, #1e40af, #3b82f6);
  color: white;
  border-radius: 12px;
  padding: 4rem 2rem;
  margin-bottom: 3rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn.primary {
  background-color: white;
  color: #1e40af;
}

.btn.primary:hover {
  background-color: #f1f5f9;
  transform: translateY(-2px);
}

.btn.secondary {
  background-color: transparent;
  border: 1px solid white;
  color: white;
}

.btn.secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

h2 {
  text-align: center;
  color: #1e40af;
  margin-bottom: 2rem;
  font-size: 1.75rem;
}

.featured-section, .discipline-section {
  margin-bottom: 4rem;
}

.featured-cards, .discipline-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.featured-card, .discipline-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.featured-card:hover, .discipline-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.featured-card h3, .discipline-card h3 {
  color: #1e40af;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
}

.featured-card p, .discipline-card p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.card-link {
  display: inline-block;
  color: #1e40af;
  font-weight: 500;
  text-decoration: none;
  position: relative;
}

.card-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #3b82f6;
  transition: width 0.3s ease;
}

.card-link:hover::after {
  width: 100%;
}

.discipline-card.run {
  border-left: 4px solid #1e40af;
}

.discipline-card.jump {
  border-left: 4px solid #3b82f6;
}

.discipline-card.throw {
  border-left: 4px solid #60a5fa;
}

@media (max-width: 768px) {
  .hero {
    padding: 3rem 1.5rem;
  }
  
  .hero h1 {
    font-size: 2rem;
  }
  
  .hero p {
    font-size: 1rem;
  }
}
</style>
