<script setup lang="ts">
import ApiStatus from '@/components/ApiStatus.vue'
</script>

<template>
  <div class="home">
    <h1>Project API Dashboard</h1>
    
    <section class="status-section">
      <h2>API Status</h2>
      <ApiStatus />
    </section>
    
    <section class="info-section">
      <h2>Welcome</h2>
      <p>
        This is the front-end interface for your Symfony API project. Use this dashboard to monitor
        and interact with your API endpoints.
      </p>
      
      <h3>Getting Started</h3>
      <p>
        Check the API status indicator above to ensure the back-end is properly connected.
        Once connected, you can start using the various features of this application.
      </p>
    </section>
  </div>
</template>

<style scoped>
.home {
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
