<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiService from '@/services/api'

// State
const apiStatus = ref<'loading' | 'online' | 'offline'>('loading')
const apiVersion = ref('')
const apiMessage = ref('')
const error = ref<string | null>(null)
const showDetails = ref(false)
const healthData = ref<any>(null)

// Check API status on component mount
onMounted(async () => {
  try {
    const response = await apiService.checkHealth()
    if (response.data) {
      apiStatus.value = 'online'
      apiMessage.value = response.data.message || 'API is running'
      
      // Gérer le cas où environment ou symfony_version n'existe pas
      if (response.data.environment && response.data.environment.symfony_version) {
        apiVersion.value = response.data.environment.symfony_version
      } else {
        apiVersion.value = 'unknown'
      }
      
      healthData.value = response.data
    }
  } catch (err: any) {
    apiStatus.value = 'offline'
    error.value = err.message || 'Unable to connect to the API'
    
    // En mode dev, simuler une connexion réussie après un délai
    if (import.meta.env.DEV) {
      console.warn('Simulating API connection in development mode')
      setTimeout(() => {
        apiStatus.value = 'online'
        apiMessage.value = 'DEV MODE: Simulated API connection'
        apiVersion.value = 'dev'
        healthData.value = {
          status: 'ok',
          message: 'DEV MODE: API simulation active'
        }
      }, 2000)
    }
    
    console.error('API health check failed:', err)
  }
})

// Toggle details visibility
const toggleDetails = () => {
  showDetails.value = !showDetails.value
}
</script>

<template>
  <div class="api-status">
    <div class="api-status-indicator">
      <span class="status-icon" :class="apiStatus"/>
      <span class="status-text">API: {{ apiStatus }}</span>
      <span v-if="apiStatus === 'online'" class="version">v{{ apiVersion }}</span>
      <button class="details-btn" @click="toggleDetails">
        {{ showDetails ? 'Hide Details' : 'Show Details' }}
      </button>
    </div>
    
    <div v-if="showDetails" class="api-details">
      <div v-if="apiStatus === 'online'">
        <p class="message">{{ apiMessage }}</p>
        <div v-if="healthData" class="health-data">
          <h4>Health Details</h4>
          <div class="detail-item">
            <span>Database:</span>
            <span :class="healthData.database.connected ? 'status-online' : 'status-offline'">
              {{ healthData.database.connected ? 'Connected' : 'Disconnected' }}
            </span>
          </div>
          <div class="detail-item">
            <span>PHP Version:</span>
            <span>{{ healthData.environment.php_version }}</span>
          </div>
          <div class="detail-item">
            <span>Server:</span>
            <span>{{ healthData.environment.server.software }}</span>
          </div>
        </div>
      </div>
      <div v-else class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.api-status {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.api-status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-icon {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-icon.loading {
  background-color: #f9a825;
  animation: pulse 1.5s infinite;
}

.status-icon.online {
  background-color: #4caf50;
}

.status-icon.offline {
  background-color: #f44336;
}

.status-text {
  font-weight: 500;
}

.version {
  color: #757575;
  font-size: 0.85em;
  margin-left: 4px;
}

.details-btn {
  margin-left: auto;
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 0.85em;
  cursor: pointer;
}

.details-btn:hover {
  background-color: #f0f0f0;
}

.api-details {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #ddd;
}

.message {
  font-style: italic;
  margin-bottom: 10px;
}

.health-data {
  background-color: #f0f4f8;
  padding: 10px;
  border-radius: 4px;
  font-size: 0.9em;
}

.health-data h4 {
  margin-top: 0;
  margin-bottom: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.status-online {
  color: #4caf50;
}

.status-offline {
  color: #f44336;
}

.error-message {
  color: #f44336;
  font-weight: 500;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
